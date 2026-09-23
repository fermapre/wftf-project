import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { safeUrl } from '../../lib/api';

export default function SocialPosts() {
  const [postsData, setPostsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    Papa.parse('/infoPOSTS.csv', {
      download: true,
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        const validRows = results.data.filter(row => row.titulo || row.fecha_publicacion);

        const formattedData = validRows.map((row) => {
          const requisitos = [
            row.requisito_1,
            row.requisito_2,
            row.requisito_3,
            row.requisito_4
          ].filter((req) => req && req.trim() !== '-' && req.trim() !== '');

          let imgName = row.imagen ? row.imagen.trim() : '';
          let finalImgPath = imgName;
          
          if (imgName && !imgName.startsWith('http') && !imgName.startsWith('/')) {
            finalImgPath = `/images/posts/${imgName}`;
          }

          const esEvento = row.es_evento_calendario
            ? ['si', 'yes', 'true', '1'].includes(row.es_evento_calendario.trim().toLowerCase())
            : false;

          return {
            fecha: row.fecha_publicacion || '',
            titulo: row.titulo || '',
            descripcion: row.contenido || '',
            resumenBreve: row.resumen_breve || '',
            ubicacion: row['ubicación'] || row.ubicacion || '',
            requisitos: requisitos,
            fechaLimite: row.fecha_limite_aplicar || '',
            link: safeUrl(row.URL),
            imagen: finalImgPath,
            esEventoCalendario: esEvento
          };
        });

        if (formattedData.length > 0) {
          setPostsData(formattedData);
        }
      },
      error: (err) => console.error('Error al leer infoPOSTS.csv:', err)
    });
  }, []);

  useEffect(() => {
    if (postsData.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === postsData.length - 1 ? 0 : prev + 1));
    }, 10000);

    return () => clearInterval(timer);
  }, [currentIndex, postsData.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? postsData.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === postsData.length - 1 ? 0 : prev + 1));
  };

  const scrollToCalendar = () => {
    const calendarSection = document.getElementById('calendario');
    if (calendarSection) {
      calendarSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (postsData.length === 0) {
    return (
      <section id="servicios" className="relative bg-[#FDDDF5] py-16 px-4 md:px-8 border-b-2 border-[#69358C]">
        <div className="text-center font-body text-[#69358C] text-xl">
          Cargando publicaciones...
        </div>
      </section>
    );
  }

  const currentPost = postsData[currentIndex];

  return (
    <section id="servicios" className="relative bg-[#FDDDF5] py-16 px-4 md:px-8 border-b-2 border-[#69358C]">
      
      {/* Título de la Sección */}
      <div className="text-center mb-10">
        <h2 className="font-title text-4xl sm:text-6xl text-[#DB37B4] tracking-wide uppercase">
          DESDE NUESTRAS REDES
        </h2>
      </div>

      {/* Indicadores Inferiores */}
      <div className="flex justify-center items-center gap-2 mt-8 mb-8">
        {postsData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-3 rounded-full transition-all cursor-pointer ${
              idx === currentIndex 
                ? 'w-8 bg-[#DB37B4]' 
                : 'w-3 bg-[#DB37B4]/40 hover:bg-[#DB37B4]/70'
            }`}
            aria-label={`Ir al post ${idx + 1}`}
          />
        ))}
      </div>

      {/* Contenedor Principal */}
      <div className="max-w-5xl mx-auto relative flex items-center justify-center">
        
        {/* Flecha Izquierda */}
        <button 
          onClick={prevSlide}
          className="absolute left-1 md:-left-6 z-20 hover:scale-110 transition-transform cursor-pointer"
          aria-label="Anterior"
        >
          <img 
            src="/images/icons/left.svg" 
            alt="Anterior" 
            className="w-10 h-10 md:w-12 md:h-12"
          />
        </button>

        {/* Tarjeta Principal */}
        <div className="bg-[#FFFDF6] border-2 border-[#69358C] rounded-3xl p-6 md:p-10 w-full shadow-[4px_4px_0px_0px_#69358C] flex flex-col md:flex-row gap-8 items-center justify-between">
          
          {/* Columna Izquierda: Información */}
          <div className="flex-1 flex flex-col justify-between h-full w-full">
            <div>
              <p className="font-body text-lg md:text-xl text-[#DB37B4] mb-2">
                fecha de publicación: {currentPost.fecha}
              </p>

              <h3 className="font-title text-3xl md:text-5xl text-[#69358C] tracking-wide mb-4">
                {currentPost.titulo}
              </h3>

              <p className="font-body text-xl md:text-2xl text-[#69358C] leading-relaxed mb-5">
                {currentPost.descripcion}
              </p>

              {/* Ubicación opcional */}
              {currentPost.ubicacion && (
                <p className="font-body text-lg md:text-xl text-[#69358C] mb-5 flex items-center gap-2">
                  <span className="font-title text-xl text-[#DB37B4]">Ubicación:</span> 
                  {currentPost.ubicacion}
                </p>
              )}

              {/* Requisitos */}
              {currentPost.requisitos.length > 0 && (
                <div className="mb-6">
                  <p className="font-title text-2xl text-[#69358C] mb-3">
                    Requisitos:
                  </p>
                  <ul className="space-y-2">
                    {currentPost.requisitos.map((req, idx) => (
                      <li key={idx} className="flex items-center gap-3 font-body text-lg md:text-xl text-[#69358C]">
                        <img 
                          src="/images/icons/star_yellow.svg" 
                          alt="star" 
                          className="w-5 h-5 min-w-[20px] object-contain"
                        />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bloque: ¿De qué trata este evento? */}
              {currentPost.resumenBreve && (
                <div className="bg-[#FFEDD2] border-2 border-[#69358C] p-4 rounded-2xl mb-6 shadow-[2px_2px_0px_0px_#69358C]">
                  <p className="font-title text-xl text-[#69358C] mb-1">
                    ¿De qué trata?
                  </p>
                  <p className="font-body text-base md:text-lg text-[#69358C]">
                    {currentPost.resumenBreve}
                  </p>
                </div>
              )}
            </div>

            <div>
              {currentPost.fechaLimite && (
                <p className="font-body text-base md:text-lg text-[#DB37B4] mb-4">
                  fecha límite para aplicar: {currentPost.fechaLimite}
                </p>
              )}

              {/* Botones de Acción Mutuamente Excluyentes */}
              <div className="flex flex-wrap items-center gap-4">
                {currentPost.esEventoCalendario ? (
                  /* SI ES EVENTO: Mostrar únicamente botón al calendario */
                  <button
                    onClick={scrollToCalendar}
                    className="inline-block border-2 border-[#69358C] bg-[#A4B4E4] px-6 py-2.5 rounded-xl font-title text-2xl text-[#0B0089] hover:bg-[#0B0089] hover:text-white transition-all shadow-[2px_2px_0px_0px_#69358C] cursor-pointer"
                  >
                    Ver en Calendario ↘︎
                  </button>
                ) : (
                  /* SI NO ES EVENTO: Mostrar botón de registro directo si existe link */
                  currentPost.link && (
                    <a 
                      href={currentPost.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block border-2 border-[#69358C] bg-white px-6 py-2.5 rounded-xl font-title text-2xl text-[#69358C] hover:bg-[#69358C] hover:text-white transition-all shadow-[2px_2px_0px_0px_#69358C]"
                    >
                      Regístrate aquí
                    </a>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Imagen */}
          <div className="w-full md:w-[380px] aspect-[4/5] flex-shrink-0 border-2 border-[#69358C] rounded-2xl overflow-hidden bg-[#FDDDF5] shadow-[2px_2px_0px_0px_#69358C]">
            <img 
              src={currentPost.imagen} 
              alt={currentPost.titulo} 
              className="w-full h-full object-contain bg-white"
            />
          </div>

        </div>

        {/* Flecha Derecha */}
        <button 
          onClick={nextSlide}
          className="absolute -right-3 md:-right-6 z-20 hover:scale-110 transition-transform cursor-pointer"
          aria-label="Siguiente"
        >
          <img 
            src="/images/icons/right.svg" 
            alt="Siguiente" 
            className="w-10 h-10 md:w-12 md:h-12"
          />
        </button>

      </div>

    </section>
  );
}