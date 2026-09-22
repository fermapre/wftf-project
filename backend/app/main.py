from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import csv
import os

app = FastAPI(title="WFTF API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NewsletterSubscriber(BaseModel):
    nombre: str
    email: str

class RSVPRegistration(BaseModel):
    nombreCompleto: str
    esEstudianteTec: str
    correo: str
    medioEnterado: str
    mandarRecordatorio: str
    evento: str

# Nuevo modelo para la burbuja de contacto
class ContactMessage(BaseModel):
    nombre: str
    email: str
    mensaje: str

@app.get("/")
def home():
    return {"status": "ok", "message": "API Activa"}

@app.post("/api/newsletter")
def subscribe_newsletter(subscriber: NewsletterSubscriber):
    try:
        data_dir = os.path.join(os.path.dirname(__file__), "data")
        os.makedirs(data_dir, exist_ok=True)
        csv_path = os.path.join(data_dir, "newsletter.csv")
        file_exists = os.path.isfile(csv_path)
        
        with open(csv_path, mode="a", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            if not file_exists:
                writer.writerow(["Nombre", "Email"])
            writer.writerow([subscriber.nombre, subscriber.email])
            
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/rsvp")
def save_rsvp(registration: RSVPRegistration):
    try:
        data_dir = os.path.join(os.path.dirname(__file__), "data")
        os.makedirs(data_dir, exist_ok=True)
        csv_path = os.path.join(data_dir, "rsvp.csv")
        file_exists = os.path.isfile(csv_path)
        
        with open(csv_path, mode="a", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            if not file_exists:
                writer.writerow(["Nombre Completo", "Estudiante Tec", "Correo", "Medio Enterado", "Recordatorio", "Evento"])
            writer.writerow([
                registration.nombreCompleto,
                registration.esEstudianteTec,
                registration.correo,
                registration.medioEnterado,
                registration.mandarRecordatorio,
                registration.evento
            ])
            
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# NUEVO ENDPOINT PARA LA BURBUJA DE CONTACTO
@app.post("/api/contacto")
def save_contact(contact: ContactMessage):
    try:
        data_dir = os.path.join(os.path.dirname(__file__), "data")
        os.makedirs(data_dir, exist_ok=True)
        csv_path = os.path.join(data_dir, "contacto.csv")
        file_exists = os.path.isfile(csv_path)
        
        with open(csv_path, mode="a", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            if not file_exists:
                writer.writerow(["Nombre", "Email", "Mensaje"])
            writer.writerow([contact.nombre, contact.email, contact.mensaje])
            
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))