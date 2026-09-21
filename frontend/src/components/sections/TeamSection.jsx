import React, { useState, useEffect } from 'react';
import teamData from '../../data/team.json';

export default function TeamSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalMembers = teamData.length;

  // Funciones para navegar
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalMembers);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalMembers) % totalMembers);
  };

  // Temporizador de 10 segundos para cambio automático
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 10000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  // Índices para integrante Anterior, Actual y Siguiente
  const prevIndex = (currentIndex - 1 + totalMembers) % totalMembers;
  const nextIndex = (currentIndex + 1) % totalMembers;

  const currentMember = teamData[currentIndex];

  return (
    <section id="nosotras" className="relative bg-[#FFFDF6] py-16 px-4 md:px-8 border-[#69358C] overflow-hidden">
      
      {/* 1. ENCABEZADO PRINCIPAL Y NAVEGACIÓN */}
      <div className="max-w-4xl mx-auto text-center mb-6">
        <div className="inline-flex items-center gap-3">
          <h2 className="font-title text-4xl sm:text-6xl text-[#69358C] tracking-wide uppercase">
            MESA DIRECTIVA
          </h2>
          <img 
            src="/images/icons/star_yellow.svg" 
            alt="Siguiente" 
            className="w-8 h-8 sm:w-12 sm:h-12" 
          />
          <span className="font-title text-4xl sm:text-6xl text-[#69358C]">
            26-27
          </span>
        </div>

        {/* BARRA DE TIEMPO AUTOMÁTICO E INDICADORES DE PUNTOS */}
        <div className="flex flex-col items-center mt-6 gap-3">
          
          {/* Barra de progreso de 10 segundos */}
          <div className="w-48 h-1.5 bg-[#69358C]/10 rounded-full overflow-hidden">
            <div 
              key={currentIndex} 
              className="h-full bg-[#DB37B4] rounded-full"
              style={{
                animationName: 'timerProgress',
                animationDuration: '10s',
                animationTimingFunction: 'linear'
              }}
            />
          </div>

          {/* Indicadores de 6 puntos (el punto seleccionado se expande) */}
          <div className="flex items-center gap-2 bg-[#FDDDF5]/40 px-4 py-1.5 rounded-full border border-[#69358C]/20">
            {teamData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ir a la integrante ${idx + 1}`}
                className={`h-3 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'w-8 bg-[#DB37B4]' 
                    : 'w-3 bg-[#69358C]/30 hover:bg-[#69358C]/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. CARRUSEL DE POLAROIDS */}
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 sm:gap-4 my-6 relative">
        
        {/* FOTO IZQUIERDA (Opacidad 50%, menor tamaño) */}
        <div 
          onClick={prevSlide}
          className="hidden sm:block cursor-pointer transition-all duration-500 transform scale-75 sm:scale-85 opacity-50 hover:opacity-80 w-44 sm:w-60 md:w-72 flex-shrink-0"
        >
          <img 
            src={teamData[prevIndex].foto} 
            alt={teamData[prevIndex].nombre}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* ESTRELLA IZQUIERDA (Ubicada junto a la foto central) */}
        <button 
          onClick={prevSlide}
          aria-label="Anterior integrante"
          className="star-pulse-left z-20 -mx-3 sm:-mx-6 p-1 transition-transform hover:scale-125 focus:outline-none flex-shrink-0"
        >
          <img 
            src="/images/icons/star_yellow.svg" 
            alt="Anterior" 
            className="w-8 h-8 sm:w-12 sm:h-12" 
          />
        </button>

        {/* FOTO CENTRO (Destacada al 100%) */}
        <div className="transition-all duration-500 transform scale-100 z-10 w-56 sm:w-72 md:w-80 flex-shrink-0">
          <img 
            src={currentMember.foto} 
            alt={currentMember.nombre}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* ESTRELLA DERECHA (Ubicada junto a la foto central) */}
        <button 
          onClick={nextSlide}
          aria-label="Siguiente integrante"
          className="star-pulse-right z-20 -mx-3 sm:-mx-6 p-1 transition-transform hover:scale-125 focus:outline-none flex-shrink-0"
        >
          <img 
            src="/images/icons/star_yellow.svg" 
            alt="Siguiente" 
            className="w-8 h-8 sm:w-12 sm:h-12" 
          />
        </button>

        {/* FOTO DERECHA (Opacidad 50%, menor tamaño) */}
        <div 
          onClick={nextSlide}
          className="cursor-pointer transition-all duration-500 transform scale-75 sm:scale-85 opacity-50 hover:opacity-80 w-44 sm:w-60 md:w-72 flex-shrink-0"
        >
          <img 
            src={teamData[nextIndex].foto} 
            alt={teamData[nextIndex].nombre}
            className="w-full h-auto object-contain"
          />
        </div>

      </div>

      {/* 3. INFORMACIÓN DE LA INTEGRANTE SELECCIONADA */}
      <div className="mt-4 text-center max-w-md mx-auto space-y-1 transition-all duration-500">
        <h3 className="font-title text-3xl sm:text-4xl text-[#69358C] tracking-wide uppercase">
          {currentMember.nombre}
        </h3>
        <p className="font-body text-base sm:text-lg text-[#69358C]/80">
          {currentMember.carrera}
        </p>
        <p className="font-body text-sm sm:text-base text-[#DB37B4] font-semibold">
          {currentMember.semestre}
        </p>
      </div>

      {/* Estilo para la animación de la barra de progreso */}
      <style>{`
        @keyframes timerProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>


    </section>
  );
}