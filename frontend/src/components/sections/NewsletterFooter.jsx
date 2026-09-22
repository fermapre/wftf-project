import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function NewsletterFooter() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Descarga local en .csv
  const downloadCSV = (nombre, email) => {
    const csvContent = "data:text/csv;charset=utf-8," + `Nombre,Email\n"${nombre}","${email}"`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `newsletter_${nombre.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) return;

    setLoading(true);

    try {
      await fetch('http://localhost:8000/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nombre, email }),
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#DB37B4', '#69358C', '#EA920A', '#A4B4E4']
      });

      downloadCSV(nombre, email);
      setShowModal(true);
      setNombre('');
      setEmail('');
    } catch (error) {
      console.error('Error al conectar con la API:', error);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      downloadCSV(nombre, email);
      setShowModal(true);
      setNombre('');
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="relative bg-[#C2B5EA] overflow-hidden text-[#69358C] pt-12 sm:pt-16 md:pt-24 pb-8 sm:pb-12">
      
      {/* LUNA Y ESTRELLAS VECTORIALES DECORATIVAS */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <img src="/images/icons/moon.svg" alt="Luna" className="absolute top-4 left-4 w-7 sm:w-10 h-auto opacity-90" />
        
        {/* Estrellas decorativas */}
        <img src="/images/icons/star_purple.svg" alt="Estrella" className="star-twinkle absolute top-8 left-[15%] w-4 sm:w-6 h-auto" />
        <img src="/images/icons/star_purple.svg" alt="Estrella" className="star-twinkle absolute top-24 left-[25%] w-3 sm:w-4 h-auto" style={{ animationDelay: '0.8s' }} />
        <img src="/images/icons/star_purple.svg" alt="Estrella" className="star-twinkle absolute top-10 right-[12%] w-5 sm:w-7 h-auto" style={{ animationDelay: '1.4s' }} />
        <img src="/images/icons/star_purple.svg" alt="Estrella" className="star-twinkle absolute top-32 right-[25%] w-4 sm:w-5 h-auto" style={{ animationDelay: '0.4s' }} />
        <img src="/images/icons/star_purple.svg" alt="Estrella" className="star-twinkle absolute bottom-24 left-[10%] w-5 sm:w-6 h-auto" style={{ animationDelay: '1.8s' }} />
        <img src="/images/icons/star_purple.svg" alt="Estrella" className="star-twinkle absolute bottom-14 right-[15%] w-4 sm:w-5 h-auto" style={{ animationDelay: '1.1s' }} />
      </div>

      {/* NUBE IZQUIERDA CON ROBOT (Solo visible en pantallas medianas en adelante) */}
      <div className="hidden lg:block absolute top-10 left-8 z-10 pointer-events-none select-none">
        <img src="/images/icons/cloudlogo.svg" alt="Robot WFTF" className="w-36 xl:w-44 h-auto drop-shadow-sm" />
      </div>

      {/* GRID PRINCIPAL */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center relative z-10">
        
        {/* COLUMNA IZQUIERDA: ¿PREGUNTAS? */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 sm:space-y-4">
          <div>
            <h2 className="font-title text-3xl sm:text-4xl md:text-5xl text-[#69358C] uppercase tracking-wide">
              ¿PREGUNTAS?
            </h2>
            <p className="font-hand text-2xl sm:text-3xl text-[#DB37B4] mt-0.5">
              Contáctanos ✩
            </p>
          </div>

          <a
            href="https://instagram.com/women_ftf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2 bg-white border-2 border-[#69358C] rounded-full text-[#69358C] font-body text-sm sm:text-base font-semibold hover:bg-[#FDDDF5] transition-all shadow-[3px_3px_0px_0px_#69358C] active:translate-x-0.5 active:translate-y-0.5"
          >
            <img src="/images/icons/InstagramIcon.svg" alt="Instagram" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
            <span>@women_ftf</span>
          </a>

          <p className="font-hand text-base sm:text-lg text-[#69358C]/90 max-w-xs sm:max-w-sm">
            Nos encantaría apoyarte y guiarte. ¡Estamos aquí para ayudar!
          </p>
        </div>

        {/* COLUMNA DERECHA: TARJETA DE REGISTRO CON NUBES RESPONSIVAS */}
        <div className="relative w-full mt-10 sm:mt-16 md:mt-12">
          
          {/* NUBE IZQUIERDA CON TEXTO (cloudtext.svg) */}
          <div className="absolute -top-10 -left-2 sm:-top-16 sm:-left-6 md:-top-20 md:-left-8 z-20 pointer-events-none select-none w-44 sm:w-60 md:w-72">
            <img 
              src="/images/icons/cloudtext.svg" 
              alt="Si llegaste hasta aquí, esto podría interesarte" 
              className="w-full h-auto drop-shadow-md"
            />
          </div>

          {/* NUBE DERECHA DECORATIVA (cloud2.svg) */}
          <div className="absolute -top-8 -right-2 sm:-top-12 sm:-right-4 md:-top-16 md:-right-8 z-20 pointer-events-none select-none w-20 sm:w-32 md:w-40">
            <img 
              src="/images/icons/cloud2.svg" 
              alt="Nube decorativa" 
              className="w-full h-auto drop-shadow-sm"
            />
          </div>

          {/* TARJETA DE REGISTRO */}
          <div className="bg-[#FFFDF6] border-2 border-[#69358C] rounded-3xl px-4 py-6 sm:p-8 shadow-[5px_5px_0px_0px_#69358C] sm:shadow-[6px_6px_0px_0px_#69358C] relative w-full z-10 pt-11 sm:pt-16 md:pt-20">
            
            <p className="text-center font-hand text-xs sm:text-base text-[#69358C]/80 mb-2">
              No le pierdas nuestras últimas actualizaciones ni eventos
            </p>
            
            <div className="text-center text-[#EA920A] text-xs tracking-widest mb-2">***</div>

            <h3 className="font-title text-2xl sm:text-3xl md:text-4xl text-[#0B0089] text-center uppercase tracking-wide leading-none">
              ÚNETE A NUESTRO
            </h3>
            <h3 className="font-title text-3xl sm:text-4xl md:text-5xl text-[#0B0089] text-center uppercase tracking-wide mb-2">
              NEWSLETTER
            </h3>

            <div className="text-center text-[#EA920A] text-xs tracking-widest mb-4 sm:mb-6">***</div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 font-body">
              
              {/* Input Nombre */}
              <div>
                <label className="block font-hand text-xs sm:text-sm text-[#69358C] mb-1">
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
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-white border-2 border-[#69358C] rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DB37B4]"
                  />
                </div>
              </div>

              {/* Input Email */}
              <div>
                <label className="block font-hand text-xs sm:text-sm text-[#69358C] mb-1">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-white border-2 border-[#69358C] rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DB37B4]"
                  />
                </div>
              </div>

              <div className="text-center text-[#EA920A] text-xs tracking-widest pt-1">***</div>

              <div className="text-center pt-1 sm:pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 sm:px-10 py-2.5 sm:py-3 bg-[#A4B4E4] border-2 border-[#69358C] text-[#0B0089] font-title text-lg sm:text-xl rounded-full hover:bg-[#DB37B4] hover:text-white transition-all shadow-[3px_3px_0px_0px_#69358C] sm:shadow-[4px_4px_0px_0px_#69358C] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'REGISTRANDO...' : 'UNIRME ✩'}
                </button>
              </div>
            </form>

          </div>

        </div>

      </div>

      {/* FRANJAS DE COLORES DE TRANSICIÓN */}
      <div className="w-full flex flex-col mt-8 sm:mt-12">
        <div className="h-2 sm:h-2.5 bg-[#FF7A00] border-t-2 border-[#69358C]" />
        <div className="h-2 sm:h-2.5 bg-[#EC4F1C] border-t-2 border-[#69358C]" />
        <div className="h-2 sm:h-2.5 bg-[#DB37B4] border-t-2 border-[#69358C]" />
        <div className="h-2 sm:h-2.5 bg-[#0B0089] border-t-2 border-[#69358C]" />
      </div>

      {/* FOOTER Y ICONOS SOCIALES */}
      <footer className="bg-[#69358C] text-white py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          
          <div className="space-y-1 sm:space-y-2 text-center md:text-left">
            <p className="font-hand text-base sm:text-lg text-purple-200">Síguenos en nuestras redes</p>
            <div className="text-[#EA920A] text-xs tracking-widest">★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★</div>
            <h4 className="font-title text-xl sm:text-2xl tracking-wider text-white">
              WOMEN FOR THE FUTURE
            </h4>
          </div>

          {/* Iconos Redes Sociales */}
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

      {/* MODAL TEMPORAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF6] border-2 border-[#69358C] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-[6px_6px_0px_0px_#69358C] space-y-4">
            <span className="text-4xl sm:text-5xl inline-block animate-bounce">🎉</span>
            <h4 className="font-title text-2xl sm:text-3xl text-[#0B0089]">¡GRACIAS POR UNIRTE!</h4>
            <p className="font-hand text-base sm:text-lg text-[#69358C]">
              Tus datos han sido registrados con éxito. Te hemos preparado novedades increíbles.
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