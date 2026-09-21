import React from 'react';

const STARS = [
  // Lado Izquierdo
  { id: 1, src: '/images/icons/star_yellow.svg', size: 'w-8 h-8', pos: 'top-12 left-6', delay: '0s', rotate: 'rotate-12' },
  { id: 2, src: '/images/icons/star_yellow.svg', size: 'w-9 h-9', pos: 'top-32 left-16', delay: '0.4s', rotate: '-rotate-6' },
  { id: 3, src: '/images/icons/star_yellow.svg', size: 'w-7 h-7', pos: 'top-1/3 left-8', delay: '1.2s', rotate: 'rotate-45' },
  { id: 4, src: '/images/icons/star_yellow.svg', size: 'w-10 h-10', pos: 'top-1/2 left-4', delay: '0.8s', rotate: '-rotate-12' },
  { id: 5, src: '/images/icons/star_yellow.svg', size: 'w-8 h-8', pos: 'bottom-40 left-16', delay: '1.6s', rotate: 'rotate-12' },
  { id: 6, src: '/images/icons/star_yellow.svg', size: 'w-9 h-9', pos: 'bottom-20 left-8', delay: '0.2s', rotate: '-rotate-45' },
  { id: 7, src: '/images/icons/star_yellow.svg', size: 'w-7 h-7', pos: 'bottom-6 left-5', delay: '1.0s', rotate: 'rotate-6' },

  // Centro Izquierdo
  { id: 8, src: '/images/icons/star_yellow.svg', size: 'w-9 h-9', pos: 'top-14 left-1/4', delay: '0.6s', rotate: '-rotate-12' },
  { id: 9, src: '/images/icons/star_yellow.svg', size: 'w-10 h-10', pos: 'top-28 left-1/3', delay: '1.4s', rotate: 'rotate-12' },
  { id: 10, src: '/images/icons/star_yellow.svg', size: 'w-8 h-8', pos: 'top-1/2 left-1/4', delay: '0.3s', rotate: 'rotate-45' },
  { id: 11, src: '/images/icons/star_yellow.svg', size: 'w-9 h-9', pos: 'bottom-1/3 left-1/4', delay: '1.1s', rotate: '-rotate-6' },
  { id: 12, src: '/images/icons/star_yellow.svg', size: 'w-8 h-8', pos: 'bottom-16 left-1/3', delay: '0.7s', rotate: 'rotate-12' },

  // Centro Derecho
  { id: 13, src: '/images/icons/star_yellow.svg', size: 'w-9 h-9', pos: 'top-12 right-1/4', delay: '0.5s', rotate: 'rotate-6' },
  { id: 14, src: '/images/icons/star_yellow.svg', size: 'w-8 h-8', pos: 'top-40 right-1/3', delay: '1.3s', rotate: '-rotate-12' },
  { id: 15, src: '/images/icons/star_yellow.svg', size: 'w-10 h-10', pos: 'top-1/2 right-1/4', delay: '0.9s', rotate: 'rotate-12' },
  { id: 16, src: '/images/icons/star_yellow.svg', size: 'w-9 h-9', pos: 'bottom-36 right-1/3', delay: '0.1s', rotate: '-rotate-45' },
  { id: 17, src: '/images/icons/star_yellow.svg', size: 'w-8 h-8', pos: 'bottom-16 right-1/4', delay: '1.5s', rotate: 'rotate-12' },

  // Lado Derecho
  { id: 18, src: '/images/icons/star_yellow.svg', size: 'w-10 h-10', pos: 'top-8 right-6', delay: '0.7s', rotate: '-rotate-12' },
  { id: 19, src: '/images/icons/star_yellow.svg', size: 'w-8 h-8', pos: 'top-24 right-16', delay: '1.1s', rotate: 'rotate-45' },
  { id: 20, src: '/images/icons/star_yellow.svg', size: 'w-9 h-9', pos: 'top-1/3 right-8', delay: '0.3s', rotate: '-rotate-6' },
  { id: 21, src: '/images/icons/star_yellow.svg', size: 'w-8 h-8', pos: 'top-1/2 right-16', delay: '1.7s', rotate: 'rotate-12' },
  { id: 22, src: '/images/icons/star_yellow.svg', size: 'w-9 h-9', pos: 'bottom-44 right-6', delay: '0.5s', rotate: '-rotate-12' },
  { id: 23, src: '/images/icons/star_yellow.svg', size: 'w-8 h-8', pos: 'bottom-24 right-14', delay: '1.3s', rotate: 'rotate-6' },
  { id: 24, src: '/images/icons/star_yellow.svg', size: 'w-10 h-10', pos: 'bottom-8 right-6', delay: '0.9s', rotate: '-rotate-45' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#FFFDF6] flex flex-col justify-between items-center overflow-hidden pt-20 border-b-2 border-[#69358C]">
      
      {/* Fondo con estrellas */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        {STARS.map((star) => (
          <img
            key={star.id}
            src={star.src}
            alt="star"
            className={`absolute ${star.pos} ${star.size} ${star.rotate} star-float transition-all`}
            style={{ animationDelay: star.delay }}
          />
        ))}
      </div>

      {/* Contenido Central */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-4 z-10 my-auto py-8">
        
        {/* Logo superior */}
        <img 
          src="/images/icons/purpleLogo.svg" 
          alt="Women for the Future Logo" 
          className="w-16 h-16 sm:w-20 sm:h-20 mb-2 object-contain"
        />

        <h1 className="font-title text-5xl sm:text-7xl md:text-8xl text-[#69358C] tracking-wide uppercase leading-tight">
          INSPIRING
        </h1>
        
        <span className="font-body text-2xl sm:text-3xl text-[#69358C] -my-1">
          to
        </span>

        <span className="font-hand text-5xl sm:text-7xl md:text-8xl text-[#69358C] leading-none my-1">
          pursue
        </span>

        <span className="font-body text-2xl sm:text-3xl text-[#69358C] -my-1">
          your
        </span>

        <h1 className="font-title text-5xl sm:text-7xl md:text-8xl text-[#69358C] tracking-wide uppercase leading-tight">
          DREAMS
        </h1>
      </div>

      {/* Franja Inferior Azul */}
      <div className="w-full bg-[#A4B4E4] border-t-2 border-[#69358C] py-3 flex justify-center items-center gap-3 z-10">
        <span className="text-xl md:text-2xl text-[#69358C] font-bold">⇩</span>
        <span className="font-body text-xl sm:text-2xl md:text-3xl text-[#69358C] tracking-wide">
          Scroll to find out more
        </span>
        <span className="text-xl md:text-2xl text-[#69358C] font-bold">⇩</span>
      </div>

    </section>
  );
}