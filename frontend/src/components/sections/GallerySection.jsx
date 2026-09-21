import React, { useState } from 'react';
import galleryData from '../../data/gallery.json';

export default function GallerySection() {
  const [expanded, setExpanded] = useState(false);

  // Muestra 3 imágenes inicialmente; si hace clic en "SEE MORE", muestra todas
  const visibleImages = expanded ? galleryData : galleryData.slice(0, 3);

  return (
    <section id="galeria" className="relative bg-[#FDDDF5] transition-all duration-500 overflow-hidden">
      
      {/* ONDA DE TRANSICIÓN SUPERIOR */}
      <div className="w-full overflow-hidden leading-none bg-[#FFFDF6] -mb-1">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-10 sm:h-14 md:h-16"
        >
          <path
            d="M0,0 C150,90 350,-20 500,50 C650,120 850,20 1000,60 C1100,80 1170,50 1200,40 L1200,120 L0,120 Z"
            fill="#FDDDF5"
            stroke="#69358C"
            strokeWidth="5"
          />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-16 space-y-8">
        
        {/* ENCABEZADO "LATELY..." */}
        <div className="text-center space-y-1">
          <h3 className="font-title text-5xl sm:text-6xl text-[#69358C] tracking-wide">
            LATELY...
          </h3>
          <p className="font-hand text-[#69358C]/80 text-xl md:text-2xl">
            Galería de fotos & eventos WFTF
          </p>
        </div>

        {/* CONTENEDOR MARCO PRINCIPAL (Azul/Lavanda con sombra flat) */}
        <div className="relative bg-[#FFEDD2] border-2 border-[#69358C] rounded-3xl p-4 sm:p-6 shadow-[8px_8px_0px_0px_#69358C]">
          
          {/* MASONRY GRID */}
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {visibleImages.map((item) => (
              <div 
                key={item.id} 
                className="break-inside-avoid relative group overflow-hidden rounded-2xl border-2 border-[#69358C] bg-white"
              >
                <img 
                  src={item.imagen}  
                  alt={item.titulo} 
                  loading="lazy"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* CONTENEDOR INFERIOR CON ELEMENTOS APILADOS */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#69358C]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end items-start p-4 gap-1.5">
                  <span className="bg-[#DB37B4] border border-[#69358C] text-white px-3 py-0.5 rounded-full font-title text-xs">
                    {item.tag}
                  </span>
                  <span className="font-body text-white text-xl">
                    {item.titulo}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* BOTÓN "SEE MORE" ALINEADO A LA DERECHA */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-5 py-1.5 bg-[#FFFDF6] border border-[#69358C] text-[#69358C] font-hand text-xl rounded-full hover:bg-[#DB37B4] hover:text-white hover:border-[#DB37B4] transition-all cursor-pointer shadow-sm"
            >
              {expanded ? 'SEE LESS' : 'SEE MORE ★'}
            </button>
          </div>

        </div>

      </div>

      {/* FRANJAS MULTICOLOR INFERIORES */}
      <div className="w-full flex flex-col">
        <div className="h-2.5 sm:h-3.5 bg-[#FF7A00] border-t-2 border-[#69358C]" />
        <div className="h-2.5 sm:h-3.5 bg-[#E63946] border-t-2 border-[#69358C]" />
        <div className="h-2.5 sm:h-3.5 bg-[#DB37B4] border-t-2 border-[#69358C]" />
        <div className="h-2.5 sm:h-3.5 bg-[#0B0089] border-t-2 border-[#69358C]" />
      </div>

    </section>
  );
}