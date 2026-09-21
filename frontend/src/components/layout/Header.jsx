import React, { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#EBD2F9] border-b-2 border-[#69358C] h-16 px-6 flex items-center shadow-sm">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between relative h-full">
        
        {/* Título Principal */}
        <button 
          onClick={scrollToTop}
          className={`font-title text-2xl md:text-3xl text-[#69358C] tracking-wide cursor-pointer absolute transition-all duration-700 ease-in-out transform ${
            scrolled 
              ? 'left-1/2 -translate-x-1/2 scale-105' 
              : 'left-0 translate-x-0'
          }`}
        >
          WOMEN FOR THE FUTURE
        </button>

        {/* Menú de Navegación con scroll suave al hacer clic */}
        <nav 
          className={`ml-auto flex items-center gap-4 sm:gap-8 font-hand text-xl sm:text-2xl transition-all duration-500 ease-in-out transform ${
            scrolled 
              ? 'opacity-0 translate-x-8 pointer-events-none' 
              : 'opacity-100 translate-x-0'
          }`}
        >
          <a 
            href="#servicios" 
            onClick={(e) => handleNavClick(e, '#servicios')}
            className="text-[#DB37B4] hover:text-[#69358C] transition-all duration-300 ease-in-out hover:scale-105 whitespace-nowrap"
          >
            SERVICIOS
          </a>
          <a 
            href="#nosotras" 
            onClick={(e) => handleNavClick(e, '#nosotras')}
            className="text-[#DB37B4] hover:text-[#69358C] transition-all duration-300 ease-in-out hover:scale-105 whitespace-nowrap"
          >
            NOSOTRAS
          </a>
          <a 
            href="#contacto" 
            onClick={(e) => handleNavClick(e, '#contacto')}
            className="border-2 border-[#69358C] text-[#69358C] px-3 py-0.5 rounded-md hover:bg-[#69358C] hover:text-white transition-all duration-300 ease-in-out hover:scale-105 text-lg sm:text-xl whitespace-nowrap"
          >
            CONTÁCTANOS
          </a>
        </nav>

      </div>
    </header>
  );
}