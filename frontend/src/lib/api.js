// Dirección del backend. En producción se define en frontend/.env.production
// (VITE_API_URL=https://api.tu-dominio.com) y SIEMPRE debe usar https.
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

if (import.meta.env.PROD && !API_URL.startsWith('https://')) {
  console.error('VITE_API_URL debe usar https:// en producción.');
}

// Envía datos al backend y lanza un error con un mensaje apto para el usuario
// si la petición no se completó correctamente.
export async function postJson(path, data) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error('No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.');
  }

  if (response.ok) return;

  if (response.status === 429) {
    throw new Error('Has enviado demasiadas solicitudes. Espera un minuto e inténtalo de nuevo.');
  }
  if (response.status === 422) {
    throw new Error('Revisa que tus datos sean correctos (por ejemplo, que el correo sea válido).');
  }
  throw new Error('Ocurrió un error al enviar tus datos. Inténtalo más tarde.');
}

// Solo permite enlaces http(s); bloquea "javascript:" y otros esquemas peligrosos.
export function safeUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : '';
  } catch {
    return '';
  }
}
