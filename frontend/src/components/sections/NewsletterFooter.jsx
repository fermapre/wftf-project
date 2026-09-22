import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function NewsletterFooter() {
  // Estados para el Newsletter
  const [newsNombre, setNewsNombre] = useState('');
  const [newsEmail, setNewsEmail] = useState('');

  // Estados para el Formulario de Contacto
  const [contactNombre, setContactNombre] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMensaje, setContactMensaje] = useState('');

  // Estados para Modales y Loader
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({ titulo: '', mensaje: '' });
  const [loading, setLoading] = useState(false);

  // Función para descargar en formato CSV
  const downloadCSV = (tipo, data) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (tipo === 'newsletter') {
      csvContent += `Nombre,Email\n"${data.nombre}","${data.email}"`;
    } else {
      csvContent += `Nombre,Email,Mensaje\n"${data.nombre}","${data.email}","${data.mensaje.replace(/"/g, '""')}"`;
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${tipo}_${data.nombre.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsNombre.trim() || !newsEmail.trim()) return;

    setLoading(true);
    try {
      await fetch('http://localhost:8000/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: newsNombre, email: newsEmail }),
      });
    } catch (error) {
      console.error('Error al conectar con la API de newsletter:', error);
    } finally {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#DB37B4', '#69358C', '#EA920A', '#A4B4E4']
      });

      downloadCSV('newsletter', { nombre: newsNombre, email: newsEmail });
      setModalInfo({
        titulo: '¡GRACIAS POR UNIRTE!',
        mensaje: 'Te has registrado exitosamente en nuestro newsletter.'
      });
      setShowModal(true);
      setNewsNombre('');
      setNewsEmail('');
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactNombre.trim() || !contactEmail.trim() || !contactMensaje.trim()) return;

    setLoading(true);
    try {
      await fetch('http://localhost:8000/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: contactNombre, email: contactEmail, mensaje: contactMensaje }),
      });
    } catch (error) {
      console.error('Error al conectar con la API de contacto:', error);
    } finally {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF7A00', '#DB37B4', '#69358C']
      });

      downloadCSV('contacto', { nombre: contactNombre, email: contactEmail, mensaje: contactMensaje });
      setModalInfo({
        titulo: '¡MENSAJE ENVIADO!',
        mensaje: 'Nos encantó recibir tu mensaje. Nos pondremos en contacto contigo muy pronto.'
      });
      setShowModal(true);
      setContactNombre('');
      setContactEmail('');
      setContactMensaje('');
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="relative bg-[#DDBCF0] overflow-hidden text-[#69358C] pt-12 pb-12">
      
      {/* ANIMACIÓN DE PARPADEO SIMPLE */}
      <style>{`
        @keyframes simpleTwinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .star-twinkle {
          animation: simpleTwinkle 2s infinite ease-in-out;
        }
      `}</style>

      {/* LUNA Y ESTRELLAS */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <img src="/images/icons/moon.svg" alt="Luna" className="absolute top-6 left-6 w-10 sm:w-16 h-auto opacity-95" />
        <img src="/images/icons/star_purple.svg" alt="Estrella" className="star-twinkle absolute top-10 left-[18%] w-5 sm:w-7 h-auto" style={{ animationDelay: '0s' }} />
        <img src="/images/icons/star_purple.svg" alt="Estrella" className="star-twinkle absolute top-28 left-[35%] w-4 sm:w-5 h-auto" style={{ animationDelay: '0.8s' }} />
        <img src="/images/icons/star_purple.svg" alt="Estrella" className="star-twinkle absolute top-12 right-[12%] w-6 sm:w-8 h-auto" style={{ animationDelay: '1.4s' }} />
        <img src="/images/icons/star_purple.svg" alt="Estrella" className="star-twinkle absolute top-36 right-[28%] w-4 sm:w-6 h-auto" style={{ animationDelay: '0.4s' }} />
        <img src="/images/icons/star_purple.svg" alt="Estrella" className="star-twinkle absolute bottom-28 left-[8%] w-5 sm:w-7 h-auto" style={{ animationDelay: '1.9s' }} />
        <img src="/images/icons/star_purple.svg" alt="Estrella" className="star-twinkle absolute bottom-16 right-[18%] w-4 sm:w-6 h-auto" style={{ animationDelay: '1.1s' }} />
      </div>

      {/* ROBOT DECORATIVO IZQUIERDA */}
      <div className="hidden lg:block absolute top-8 left-6 z-10 pointer-events-none select-none">
        <img src="/images/icons/cloudlogo.svg" alt="Robot WFTF" className="w-36 xl:w-44 h-auto drop-shadow-md" />
      </div>

      {/* GRID PRINCIPAL */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative z-10">
        
        {/* COLUMNA IZQUIERDA: BURBUJA DE CONTACTO */}
        <div className="w-full flex flex-col items-start">
          
          {/* NUBE DESPLAZADA A LA DERECHA */}
          <div 
            className="relative z-20 pointer-events-none select-none w-48 sm:w-56 md:w-64"
            style={{ 
              marginBottom: '-15px', 
              marginLeft: 'auto', 
              marginRight: '-150px' 
            }}
          >
            <img 
              src="/images/icons/cloudtext.svg" 
              alt="Si llegaste hasta aquí..." 
              className="w-full h-auto drop-shadow-md"
            />
          </div>

          {/* Tarjeta con espacio superior */}
          <div className="relative w-full bg-[#FFFDF6] border-3 border-[#69358C] rounded-[2.5rem] p-6 sm:p-8 pt-12 sm:pt-14 shadow-[6px_6px_0px_0px_#69358C] text-left z-10">
            
            {/* Pico de la burbuja */}
            <div className="absolute -bottom-5 left-12 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[20px] border-t-[#69358C]">
              <div className="absolute -top-[23px] -left-[13px] w-0 h-0 border-l-[13px] border-l-transparent border-r-[13px] border-r-transparent border-t-[17px] border-t-[#FFFDF6]"></div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h2 className="font-title text-2xl sm:text-3xl md:text-4xl text-[#69358C] uppercase tracking-wide leading-tight">
                  ¿PREGUNTAS?
                </h2>
                <p className="font-hand text-xl sm:text-2xl text-[#DB37B4]">
                  ★ Contáctanos ★
                </p>
              </div>

              <a
                href="https://instagram.com/women_ftf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FDDDF5] border-2 border-[#69358C] rounded-full text-[#69358C] font-body text-xl sm:text-xl font-semibold hover:bg-white transition-all shadow-[2px_2px_0px_0px_#69358C]"
              >
                <img src="/images/icons/InstagramIcon.svg" alt="Instagram" className="w-10 h-10 object-contain" />
                <span>@women_ftf</span>
              </a>
            </div>

            <p className="font-body text-xl sm:text-xl text-[#69358C]/90 mb-4">
              Nos encantaría apoyarte y guiarte. ¡Déjanos un mensaje y te responderemos!
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-3 font-body">
              <div>
                <label className="block font-body text-xl sm:text-xl text-[#69358C] mb-1">
                  Tu nombre *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Escribe tu nombre"
                  value={contactNombre}
                  onChange={(e) => setContactNombre(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-[#69358C] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DB37B4]"
                />
              </div>

              <div>
                <label className="block font-body text-xl sm:text-xl text-[#69358C] mb-1">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-[#69358C] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DB37B4]"
                />
              </div>

              <div>
                <label className="block font-body text-xl sm:text-xl text-[#69358C] mb-1">
                  Tu mensaje *
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="¿En qué te podemos ayudar?"
                  value={contactMensaje}
                  onChange={(e) => setContactMensaje(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-[#69358C] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DB37B4] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#DB37B4] border-2 border-[#69358C] text-white font-title text-base sm:text-lg rounded-full hover:bg-[#69358C] transition-all shadow-[3px_3px_0px_0px_#69358C] cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
              </button>
            </form>

          </div>
        </div>

        {/* COLUMNA DERECHA: NEWSLETTER */}
        <div className="w-full flex flex-col items-end pt-4 lg:pt-8">
          
          <div 
            className="relative z-20 pointer-events-none select-none w-20 sm:w-28 md:w-32"
            style={{ marginBottom: '-20px', marginRight: '15px' }}
          >
            <img 
              src="/images/icons/cloud2.svg" 
              alt="Nube decorativa" 
              className="w-full h-auto drop-shadow-sm"
            />
          </div>

          <div className="bg-[#FFFDF6] border-3 border-[#69358C] rounded-[2.5rem] px-5 py-6 sm:p-8 shadow-[6px_6px_0px_0px_#69358C] relative w-full z-10 pt-8 sm:pt-10">
            
            <p className="text-center font-body text-3xl sm:text-2xl text-[#69358C]/80 mb-2">
              No te pierdas nuestras últimas actualizaciones ni eventos
            </p>
            
            <div className="text-center text-[#EA920A] text-xs tracking-widest mb-2">***</div>

            <h3 className="font-title text-3xl sm:text-4xl md:text-5xl text-[#0B0089] text-center uppercase tracking-wide leading-none">
              ÚNETE A NUESTRO
            </h3>
            <h3 className="font-title text-4xl sm:text-5xl md:text-6xl text-[#0B0089] text-center uppercase tracking-wide mb-2">
              NEWSLETTER
            </h3>

            <div className="text-center text-[#EA920A] text-xs tracking-widest mb-4 sm:mb-6">***</div>

            <form onSubmit={handleNewsletterSubmit} className="space-y-3 sm:space-y-4 font-body">
              <div>
                <label className="block font-body text-xl sm:text-xl text-[#69358C] mb-1">
                  Ingresa tu nombre *
                </label>
                <div className="relative flex items-center">
                  <img 
                    src="/images/icons/happyface.svg" 
                    alt="Carita Feliz" 
                    className="absolute left-3 w-4 h-4 sm:w-5 sm:h-5 object-contain pointer-events-none" 
                  />
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre"
                    value={newsNombre}
                    onChange={(e) => setNewsNombre(e.target.value)}
                    className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-white border-2 border-[#69358C] rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DB37B4]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-xl sm:text-xl text-[#69358C] mb-1">
                  Ingresa tu correo electrónico *
                </label>
                <div className="relative flex items-center">
                  <img 
                    src="/images/icons/email.svg" 
                    alt="Correo" 
                    className="absolute left-3 w-4 h-4 sm:w-5 sm:h-5 object-contain pointer-events-none" 
                  />
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={newsEmail}
                    onChange={(e) => setNewsEmail(e.target.value)}
                    className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-white border-2 border-[#69358C] rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DB37B4]"
                  />
                </div>
              </div>

              <div className="text-center text-[#EA920A] text-xs tracking-widest pt-1">***</div>

              <div className="text-center pt-1 sm:pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 sm:px-10 py-2.5 sm:py-3 bg-[#A4B4E4] border-2 border-[#69358C] text-[#0B0089] font-title text-lg sm:text-xl rounded-full hover:bg-[#DB37B4] hover:text-white transition-all shadow-[3px_3px_0px_0px_#69358C] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'REGISTRANDO...' : 'UNIRME'}
                </button>
              </div>
            </form>

          </div>

        </div>

      </div>

      {/* FRANJAS DE COLORES DE TRANSICIÓN */}
      <div className="w-full flex flex-col mt-16 sm:mt-20">
        <div className="h-2 sm:h-2.5 bg-[#FF7A00] border-t-2 border-[#69358C]" />
        <div className="h-2 sm:h-2.5 bg-[#EC4F1C] border-t-2 border-[#69358C]" />
        <div className="h-2 sm:h-2.5 bg-[#DB37B4] border-t-2 border-[#69358C]" />
        <div className="h-2 sm:h-2.5 bg-[#0B0089] border-t-2 border-[#69358C]" />
      </div>

      {/* FOOTER Y ÍCONOS SOCIALES */}
      <footer className="bg-[#3B1F69] text-white py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          
          <div className="space-y-1 sm:space-y-2 text-center md:text-left">
            <p className="font-hand text-base sm:text-lg text-purple-200">Síguenos en nuestras redes</p>
            <div className="text-[#EA920A] text-xs tracking-widest">★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★</div>
            <h4 className="font-title text-xl sm:text-2xl tracking-wider text-white">
              WOMEN FOR THE FUTURE
            </h4>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://instagram.com/women_ftf" target="_blank" rel="noopener noreferrer">
              <img src="/images/icons/InstagramIcon.svg" alt="Instagram" className="w-8 h-8 sm:w-9 sm:h-9 hover:scale-110 transition-transform" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <img src="/images/icons/LinkedInIcon.svg" alt="LinkedIn" className="w-8 h-8 sm:w-9 sm:h-9 hover:scale-110 transition-transform" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="/images/icons/facebookIcon.svg" alt="Facebook" className="w-8 h-8 sm:w-9 sm:h-9 hover:scale-110 transition-transform" />
            </a>
          </div>

        </div>

        <div className="max-w-5xl mx-auto mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-purple-400/30 text-center md:text-right">
          <a href="#terminos" className="font-body text-xs text-purple-200 hover:underline">
            Términos y condiciones
          </a>
        </div>
      </footer>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF6] border-3 border-[#69358C] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-[6px_6px_0px_0px_#69358C] space-y-4">
            <span className="text-4xl sm:text-5xl inline-block animate-bounce">🎉</span>
            <h4 className="font-title text-2xl sm:text-3xl text-[#0B0089]">{modalInfo.titulo}</h4>
            <p className="font-hand text-base sm:text-lg text-[#69358C]">
              {modalInfo.mensaje}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="px-8 py-2.5 bg-[#DB37B4] border-2 border-[#69358C] text-white font-title text-base sm:text-lg rounded-full hover:bg-[#69358C] transition-all cursor-pointer shadow-[3px_3px_0px_0px_#69358C]"
            >
              ACEPTAR ✩
            </button>
          </div>
        </div>
      )}

    </section>
  );
}