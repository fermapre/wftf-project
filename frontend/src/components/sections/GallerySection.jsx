import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function GallerySection() {
  const [galleryData, setGalleryData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carga y parsea el CSV al montar el componente
  useEffect(() => {
    Papa.parse('/infoGALERIA.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      if (results.data && results.data.length > 0) {
        // Invertimos el orden de los datos recibidos
        const reversedData = [...results.data].reverse();
        
        setGalleryData(reversedData);
        setSelectedImage(reversedData[0]); // Selecciona el id 9 por defecto
      }
      setLoading(false);
    },
    error: (err) => {
      console.error('Error al parsear el CSV de galería:', err);
      setLoading(false);
    }
  });
  }, []);

  if (loading) {
    return (
      <section id="galeria" className="relative bg-[#FDDDF5] py-16 text-center">
        <p className="font-title text-[#69358C] text-2xl">Cargando galería...</p>
      </section>
    );
  }

  return (
    <section id="galeria" className="relative bg-[#FDDDF5] transition-all duration-500 overflow-hidden">

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

        {/* CONTENEDOR TIPO VISOR (Marco Principal) */}
        <div className="relative bg-[#FFFDF6] border-2 border-[#69358C] rounded-3xl p-4 sm:p-6 shadow-[8px_8px_0px_0px_#69358C]">
          
          {/* 1. IMAGEN PRINCIPAL / DESTACADA */}
          <div className="w-full h-72 sm:h-96 md:h-[480px] overflow-hidden rounded-2xl border-2 border-[#69358C] bg-black/5">
            {selectedImage && (
              <img 
                src={selectedImage.imagen}  
                alt={selectedImage.titulo || 'Foto de Galería'} 
                className="w-full h-full object-cover transition-all duration-300"
              />
            )}
          </div>

          {/* 2. TEXTO E INFORMACIÓN (Título y Subtítulo/Autor) */}
          <div className="mt-5 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-hand text-2xl sm:text-3xl text-[#69358C]">
                {selectedImage?.titulo}
              </h4>
              {selectedImage?.categoria && (
                <span className="bg-[#DB37B4] border border-[#69358C] text-white px-3 py-0.5 rounded-full font-title text-xs">
                  {selectedImage.categoria}
                </span>
              )}
            </div>
          </div>

          {/* 3. TIRA DE MINIATURAS INTERACTIVAS */}
          <div className="mt-6 flex items-center gap-3 overflow-x-auto py-3 px-2 scrollbar-thin">
            {galleryData.map((item, index) => {
              const isSelected = selectedImage?.id ? selectedImage.id === item.id : selectedImage === item;
              return (
                <button
                  key={item.id || index}
                  onClick={() => setSelectedImage(item)}
                  className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'border-[#DB37B4] scale-105 shadow-md ring-2 ring-[#DB37B4]/50' 
                      : 'border-[#69358C] opacity-70 hover:opacity-100 hover:scale-100'
                  }`}
                >
                  <img 
                    src={item.imagen} 
                    alt={item.titulo || `Miniatura ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
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