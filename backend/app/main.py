import csv
import fcntl
import logging
import os
import re
import threading
import time
from collections import defaultdict, deque
from typing import Literal

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator

logger = logging.getLogger("wftf")

# ---------------------------------------------------------------------------
# Configuración (se toma de variables de entorno; ver backend/.env.example)
# ---------------------------------------------------------------------------

# Dominios del frontend que pueden llamar a la API, separados por comas.
ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    if o.strip()
]

# Carpeta donde se guardan los datos personales. En producción debe estar
# FUERA de la carpeta del código y del sitio público.
DATA_DIR = os.getenv(
    "DATA_DIR", os.path.join(os.path.dirname(__file__), "data")
)

# Solo mostrar la documentación automática (/docs) en desarrollo.
ENABLE_DOCS = os.getenv("ENABLE_DOCS", "false").lower() == "true"

# Límite de peticiones por IP (por ventana de tiempo) para frenar spam y abuso.
RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", "10"))
RATE_LIMIT_WINDOW_SECONDS = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60"))

# Tamaño máximo del cuerpo de una petición (bytes).
MAX_BODY_BYTES = 10 * 1024

app = FastAPI(
    title="WFTF API",
    docs_url="/docs" if ENABLE_DOCS else None,
    redoc_url=None,
    openapi_url="/openapi.json" if ENABLE_DOCS else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


# ---------------------------------------------------------------------------
# Middlewares de seguridad
# ---------------------------------------------------------------------------

_rate_lock = threading.Lock()
_rate_hits: dict[str, deque] = defaultdict(deque)


def _rate_limited(ip: str) -> bool:
    now = time.monotonic()
    with _rate_lock:
        hits = _rate_hits[ip]
        while hits and now - hits[0] > RATE_LIMIT_WINDOW_SECONDS:
            hits.popleft()
        if len(hits) >= RATE_LIMIT_REQUESTS:
            return True
        hits.append(now)
        # Evitar que el diccionario crezca sin límite.
        if len(_rate_hits) > 10_000:
            for key in [k for k, v in _rate_hits.items() if not v]:
                del _rate_hits[key]
        return False


@app.middleware("http")
async def security_middleware(request: Request, call_next):
    if request.method == "POST":
        # Rechazar cuerpos demasiado grandes antes de procesarlos.
        length = request.headers.get("content-length")
        if length is None or not length.isdigit() or int(length) > MAX_BODY_BYTES:
            return JSONResponse({"detail": "Petición no válida."}, status_code=413)

        # Solo aceptamos JSON (bloquea envíos desde formularios de otros sitios).
        if not request.headers.get("content-type", "").startswith("application/json"):
            return JSONResponse({"detail": "Petición no válida."}, status_code=415)

        ip = request.client.host if request.client else "unknown"
        if _rate_limited(ip):
            return JSONResponse(
                {"detail": "Demasiadas solicitudes. Intenta de nuevo en un momento."},
                status_code=429,
            )

    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Cache-Control"] = "no-store"
    response.headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'"
    return response


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    # Nunca mostrar detalles internos (rutas, errores) al usuario.
    logger.exception("Error no controlado en %s", request.url.path)
    return JSONResponse({"detail": "Ocurrió un error. Intenta más tarde."}, status_code=500)


# ---------------------------------------------------------------------------
# Modelos (validación estricta de lo que envía el usuario)
# ---------------------------------------------------------------------------

_CONTROL_CHARS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")
_TEC_EMAIL = re.compile(r"^[^@\s]+@(tec\.mx|itesm\.mx)$", re.IGNORECASE)


class StrictModel(BaseModel):
    # Rechaza campos desconocidos y recorta espacios.
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    # Campo trampa invisible para humanos; si un bot lo llena, se descarta.
    website: str = Field(default="", max_length=200)

    @field_validator("*", mode="before")
    @classmethod
    def _remove_control_chars(cls, value):
        if isinstance(value, str):
            return _CONTROL_CHARS.sub("", value)
        return value


class NewsletterSubscriber(StrictModel):
    nombre: str = Field(min_length=1, max_length=100)
    email: EmailStr = Field(max_length=254)


class RSVPRegistration(StrictModel):
    nombreCompleto: str = Field(min_length=1, max_length=150)
    esEstudianteTec: Literal["Sí", "No"]
    correo: EmailStr = Field(max_length=254)
    medioEnterado: Literal["instagram", "amigos", "carteles", "otro"]
    mandarRecordatorio: Literal["Sí", "No"]
    evento: str = Field(min_length=1, max_length=150)

    @model_validator(mode="after")
    def _tec_email_required(self):
        if self.esEstudianteTec == "Sí" and not _TEC_EMAIL.match(self.correo):
            raise ValueError("Se requiere un correo institucional (@tec.mx o @itesm.mx).")
        return self


class ContactMessage(StrictModel):
    nombre: str = Field(min_length=1, max_length=100)
    email: EmailStr = Field(max_length=254)
    mensaje: str = Field(min_length=1, max_length=2000)


# ---------------------------------------------------------------------------
# Almacenamiento seguro en CSV
# ---------------------------------------------------------------------------

def _csv_safe(value: str) -> str:
    """Evita "inyección de fórmulas": si una celda empieza con =, +, -, @
    (o tab/retorno), Excel/Sheets la ejecutaría como fórmula al abrir el archivo."""
    value = str(value)
    if value and value[0] in ("=", "+", "-", "@", "\t", "\r"):
        return "'" + value
    return value


def _append_row(filename: str, header: list[str], row: list[str], unique_col: int | None = None) -> None:
    os.makedirs(DATA_DIR, mode=0o700, exist_ok=True)
    path = os.path.join(DATA_DIR, filename)

    # Archivo legible solo por el usuario del servidor (permisos 600).
    fd = os.open(path, os.O_RDWR | os.O_CREAT | os.O_APPEND, 0o600)
    with os.fdopen(fd, "r+", newline="", encoding="utf-8") as file:
        # Bloqueo para que dos peticiones simultáneas no corrompan el archivo.
        fcntl.flock(file, fcntl.LOCK_EX)
        try:
            file.seek(0)
            existing = list(csv.reader(file))
            safe_row = [_csv_safe(v) for v in row]

            if unique_col is not None:
                key = safe_row[unique_col].lower()
                if any(len(r) > unique_col and r[unique_col].lower() == key for r in existing[1:]):
                    return

            writer = csv.writer(file)
            if not existing:
                writer.writerow(header)
            writer.writerow(safe_row)
            file.flush()
            os.fsync(file.fileno())
        finally:
            fcntl.flock(file, fcntl.LOCK_UN)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/")
def home():
    return {"status": "ok"}


@app.post("/api/newsletter")
def subscribe_newsletter(subscriber: NewsletterSubscriber):
    if subscriber.website:
        return {"status": "success"}
    _append_row(
        "newsletter.csv",
        ["Nombre", "Email"],
        [subscriber.nombre, subscriber.email],
        unique_col=1,
    )
    return {"status": "success"}


@app.post("/api/rsvp")
def save_rsvp(registration: RSVPRegistration):
    if registration.website:
        return {"status": "success"}
    _append_row(
        "rsvp.csv",
        ["Nombre Completo", "Estudiante Tec", "Correo", "Medio Enterado", "Recordatorio", "Evento"],
        [
            registration.nombreCompleto,
            registration.esEstudianteTec,
            registration.correo,
            registration.medioEnterado,
            registration.mandarRecordatorio,
            registration.evento,
        ],
    )
    return {"status": "success"}


@app.post("/api/contacto")
def save_contact(contact: ContactMessage):
    if contact.website:
        return {"status": "success"}
    _append_row(
        "contacto.csv",
        ["Nombre", "Email", "Mensaje"],
        [contact.nombre, contact.email, contact.mensaje],
    )
    return {"status": "success"}
