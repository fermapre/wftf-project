import React, { useState } from 'react';
import { postJson } from '../../lib/api';

export default function RsvpModal({ event, onClose }) {
  const [fullName, setFullName] = useState('');
  const [isTec, setIsTec] = useState('si');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState('');
  const [sendReminder, setSendReminder] = useState('si');
  
  const [emailError, setEmailError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Campo trampa para bots
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setSubmitError('');

    // Validar correo institucional únicamente cuando seleccionó "Sí"
    if (isTec === 'si') {
      const tecEmailRegex = /^[a-zA-Z0-9._%+-]+@(tec\.mx|itesm\.mx)$/i;
      if (!tecEmailRegex.test(email.trim())) {
        setEmailError('Ingresa un correo institucional válido (@tec.mx o @itesm.mx)');
        return;
      }
    }

    setLoading(true);

    // Formato exacto que espera FastAPI en main.py
    const registrationData = {
      nombreCompleto: fullName,
      esEstudianteTec: isTec === 'si' ? 'Sí' : 'No',
      correo: email,
      medioEnterado: source,
      mandarRecordatorio: sendReminder === 'si' ? 'Sí' : 'No',
      evento: event.title,
      website: honeypot
    };

    try {
      await postJson('/api/rsvp', registrationData);
      setSubmitted(true);
    } catch (error) {
      // Solo confirmamos el registro si realmente se guardó
      setSubmitError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-[#FFFDF6] border-2 border-[#69358C] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[6px_6px_0px_0px_#69358C] relative animate-in fade-in zoom-in duration-200">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#69358C] font-title text-2xl hover:scale-125 transition-transform cursor-pointer"
        >
          ✕
        </button>

        {!submitted ? (
          <>
            <h3 className="font-title text-3xl text-[#69358C] mb-1">REGISTRO DE ASISTENCIA</h3>
            <p className="font-body text-xl text-[#DB37B4] mb-3">{event.title}</p>

            <p className="font-body text-xl text-[#9A76AF] mb-1">{event.description}</p>
            <p className="font-body text-l text-[#9A76AF] mb-1">{event.location}</p>
            <p className="font-body text-s text-[#9A76AF] mb-6">{event.time}</p>

            <form onSubmit={handleSubmit} className="space-y-4 font-body text-[#69358C]">
              {/* Campo trampa: invisible para personas, los bots lo llenan */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
              />
              
              {/* 1. Nombre Completo */}
              <div>
                <label className="block text-lg mb-1 font-bold">1. Nombre completo *</label>
                <input 
                  type="text" 
                  required 
                  maxLength={150}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full border-2 border-[#69358C] rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#DB37B4]"
                />
              </div>

              {/* 2. ¿Estudiante Tec de Mty? */}
              <div>
                <label className="block text-lg mb-1 font-bold">2. ¿Estudiante Tec de Mty? *</label>
                <div className="flex gap-6 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="tec" 
                      value="si" 
                      checked={isTec === 'si'}
                      onChange={() => {
                        setIsTec('si');
                        setEmailError('');
                      }}
                      className="accent-[#69358C]"
                    />
                    <span>Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="tec" 
                      value="no" 
                      checked={isTec === 'no'}
                      onChange={() => {
                        setIsTec('no');
                        setEmailError('');
                      }}
                      className="accent-[#69358C]"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {/* 3. Correo (con restricción de dominio) */}
              <div>
                <label className="block text-lg mb-1 font-bold">
                  3. {isTec === 'si' ? 'Correo institucional (@tec.mx) *' : 'Correo personal *'}
                </label>
                <input 
                  type="email" 
                  required 
                  maxLength={254}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder={isTec === 'si' ? 'A00xxxxxx@tec.mx' : 'ejemplo@correo.com'}
                  className={`w-full border-2 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 ${
                    emailError ? 'border-red-500 focus:ring-red-400' : 'border-[#69358C] focus:ring-[#DB37B4]'
                  }`}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1 font-bold">{emailError}</p>
                )}
              </div>

              {/* 4. Menú desplegable */}
              <div>
                <label className="block text-lg mb-1 font-bold">4. ¿Dónde te enteraste del evento? *</label>
                <select 
                  required 
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full border-2 border-[#69358C] rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#DB37B4]"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="instagram">Instagram</option>
                  <option value="amigos">Amigos / Recomendación</option>
                  <option value="carteles">Carteles en Campus</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {/* 5. Mandar recordatorio */}
              <div>
                <label className="block text-lg mb-1 font-bold">5. ¿Mandar recordatorio por correo? *</label>
                <div className="flex flex-col gap-2 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="recordatorio" 
                      value="si" 
                      checked={sendReminder === 'si'}
                      onChange={() => setSendReminder('si')}
                      className="accent-[#69358C]" 
                    />
                    <span>Sí, enviar recordatorio</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="recordatorio" 
                      value="no" 
                      checked={sendReminder === 'no'}
                      onChange={() => setSendReminder('no')}
                      className="accent-[#69358C]" 
                    />
                    <span>No enviar recordatorio</span>
                  </label>
                </div>
              </div>

              <p className="text-xs text-[#DB37B4] italic">* Todas las respuestas son obligatorias</p>

              {submitError && (
                <p className="text-red-500 text-sm font-bold" role="alert">{submitError}</p>
              )}

              {/* Botón Completar Registro */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full border-2 border-[#69358C] bg-[#A4B4E4] font-title text-2xl text-[#69358C] py-3 rounded-xl hover:bg-[#69358C] hover:text-white transition-all shadow-[2px_2px_0px_0px_#69358C] mt-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'COMPLETANDO...' : 'Completar Registro'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8 space-y-4">
            <span className="text-6xl">✨</span>
            <h3 className="font-title text-4xl text-[#69358C]">¡REGISTRO EXITOSO!</h3>
            <p className="font-body text-xl text-[#69358C]">
              Gracias <strong className="text-[#DB37B4]">{fullName}</strong>, tu lugar para <strong>{event.title}</strong> ha quedado registrado.
            </p>

            <button 
              onClick={onClose}
              className="border-2 border-[#69358C] bg-[#FDDDF5] font-title text-xl text-[#69358C] px-6 py-2 rounded-xl hover:bg-[#69358C] hover:text-white transition-all cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}

      </div>
    </div>
  );
}