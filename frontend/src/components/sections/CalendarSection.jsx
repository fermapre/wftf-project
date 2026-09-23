import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { safeUrl } from '../../lib/api';
import RsvpModal from '../ui/RsvpModal';

const MONTHS = [
  { name: 'SEPTIEMBRE', year: 2026, monthNum: 8, daysInMonth: 30, startDayOffset: 2 }, // Sep 1 es Martes (Offset 2)
  { name: 'OCTUBRE', year: 2026, monthNum: 9, daysInMonth: 31, startDayOffset: 4 },    // Oct 1 es Jueves (Offset 4)
  { name: 'NOVIEMBRE', year: 2026, monthNum: 10, daysInMonth: 30, startDayOffset: 0 },  // Nov 1 es Domingo (Offset 0)
  { name: 'DICIEMBRE', year: 2026, monthNum: 11, daysInMonth: 31, startDayOffset: 2 }   // Dic 1 es Martes (Offset 2)
];

export default function CalendarSection() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fecha real actual
  const today = new Date();
  const realDay = today.getDate();
  const realMonth = today.getMonth(); // 0-11
  const realYear = today.getFullYear();

  // Buscar el mes inicial por defecto
  const initialMonthIdx = MONTHS.findIndex(
    (m) => m.year === realYear && m.monthNum === realMonth
  );

  const [currentMonthIdx, setCurrentMonthIdx] = useState(
    initialMonthIdx !== -1 ? initialMonthIdx : 0
  );

  const activeMonth = MONTHS[currentMonthIdx];
  const isCurrentMonthActive = activeMonth.year === realYear && activeMonth.monthNum === realMonth;

  // Cargar eventos desde infoCALENDARIO.csv
  useEffect(() => {
    Papa.parse('/infoCALENDARIO.csv', {
      download: true,
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        const parsedEvents = results.data
          .filter(row => row.fecha_iso && row.titulo)
          .map((row) => {
            // fecha_iso en formato YYYY-MM-DD
            const [year, month, day] = row.fecha_iso.split('-').map(Number);
            
            // Buscar índice de mes en nuestro arreglo MONTHS
            const monthIdx = MONTHS.findIndex(
              (m) => m.year === year && m.monthNum === (month - 1)
            );

            return {
              monthIndex: monthIdx,
              day: day,
              title: row.titulo || '',
              description: row.resumen_breve || '',
              location: row.ubicacion || '',
              time: row.hora || '',
              sticker: row.sticker_icon?.trim() || '/images/icons/RSVPsticker1.svg',
              link: safeUrl(row.URL)
            };
          })
          .filter(event => event.monthIndex !== -1); // Conservar solo meses contemplados

        setEvents(parsedEvents);
      },
      error: (err) => console.error('Error al leer infoCALENDARIO.csv:', err)
    });
  }, []);

  const handlePrevMonth = () => {
    if (currentMonthIdx > 0) setCurrentMonthIdx(currentMonthIdx - 1);
  };

  const handleNextMonth = () => {
    if (currentMonthIdx < MONTHS.length - 1) setCurrentMonthIdx(currentMonthIdx + 1);
  };

  return (
    <section id="calendario" className="bg-[#FFEDD2] border-b-2">

      {/* Franja Azul Superior */}
      <div className="w-full bg-[#A4B4E4] border-t-6 border-b-2 border-[#69358C] py-3 z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="font-hand text-xl sm:text-2xl md:text-3xl text-[#0B0089] tracking-wide">
            ¡No te lo pierdas!
          </span>
          <span className="font-hand text-xl sm:text-2xl md:text-3xl text-[#0B0089] tracking-wide text-right">
            RESERVAR NUNCA HABÍA SIDO TAN SENCILLO
          </span>
        </div>
      </div>
      
      {/* Encabezado del Calendario */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="font-title text-5xl md:text-6xl text-[#69358C] tracking-wide">
            CALENDARIO
          </h2>
          <p className="font-hand text-lg text-[#69358C] mt-1">
            CLICK EN RSVP PARA MÁS INFO
          </p>
        </div>

        {/* Control del Mes */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4">
            {currentMonthIdx > 0 ? (
              <button 
                onClick={handlePrevMonth}
                className="hover:scale-125 transition-transform cursor-pointer"
                aria-label="Mes anterior"
              >
                <img src="/images/icons/left_pink.svg" alt="Anterior" className="w-8 h-8" />
              </button>
            ) : <div className="w-8 h-8" />}

            <h3 className="font-title text-4xl md:text-5xl text-[#69358C] uppercase tracking-wide min-w-[220px] text-center">
              {activeMonth.name}
            </h3>

            {currentMonthIdx < MONTHS.length - 1 ? (
              <button 
                onClick={handleNextMonth}
                className="hover:scale-125 transition-transform cursor-pointer"
                aria-label="Siguiente mes"
              >
                <img src="/images/icons/right_pink.svg" alt="Siguiente" className="w-8 h-8" />
              </button>
            ) : <div className="w-8 h-8" />}
          </div>

          <span className="font-body text-sm text-[#69358C]/70 mt-1">
            periodo sept - dic 2026
          </span>
        </div>
      </div>

      {/* Grid del Calendario */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-12">
        <div className="border-2 border-[#69358C] rounded-2xl overflow-hidden bg-white shadow-[4px_4px_0px_0px_#69358C]">
          
          {/* Encabezado Días de la semana */}
          <div className="grid grid-cols-7 bg-[#FDDDF5] border-b-2 border-[#69358C] font-hand text-xs sm:text-lg md:text-2xl text-[#69358C] text-center py-2">
            <div><span className="hidden sm:inline">Domingo</span><span className="sm:hidden">D</span></div>
            <div><span className="hidden sm:inline">Lunes</span><span className="sm:hidden">L</span></div>
            <div><span className="hidden sm:inline">Martes</span><span className="sm:hidden">M</span></div>
            <div><span className="hidden sm:inline">Miércoles</span><span className="sm:hidden">M</span></div>
            <div><span className="hidden sm:inline">Jueves</span><span className="sm:hidden">J</span></div>
            <div><span className="hidden sm:inline">Viernes</span><span className="sm:hidden">V</span></div>
            <div><span className="hidden sm:inline">Sábado</span><span className="sm:hidden">S</span></div>
          </div>

          {/* Cuadrícula de Días */}
          <div className="grid grid-cols-7 auto-rows-fr">
            {/* Celdas vacías del offset inicial */}
            {Array.from({ length: activeMonth.startDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[90px] md:min-h-[120px] border-b border-r border-[#69358C]/20 bg-[#FFFDF6]/50" />
            ))}

            {/* Días del mes */}
            {Array.from({ length: activeMonth.daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isToday = isCurrentMonthActive && dayNum === realDay;
              const dayEvent = events.find(e => e.monthIndex === currentMonthIdx && e.day === dayNum);

              return (
                <div 
                  key={dayNum}
                  className={`min-h-[90px] md:min-h-[120px] p-2 border-b border-r border-[#69358C]/30 flex flex-col justify-between relative transition-colors ${
                    isToday ? 'bg-[#FDDDF5]/60 font-bold ring-2 ring-inset ring-[#DB37B4]' : 'bg-white'
                  }`}
                >
                  {/* Número de Día y Marca de Visita */}
                  <div className="flex justify-between items-center font-body text-base md:text-lg text-[#69358C]">
                    <span>{dayNum}</span>
                    {isToday && (
                      <span className="text-[10px] font-hand bg-[#DB37B4] text-white px-1.5 py-0.5 rounded-full">
                        Hoy
                      </span>
                    )}
                  </div>

                  {/* Evento y Botón RSVP */}
                  {dayEvent && (
                    <button
                      onClick={() => setSelectedEvent(dayEvent)}
                      className="mt-auto group flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                    >
                      <img 
                        src={dayEvent.sticker} 
                        alt="RSVP" 
                        className="w-12 md:w-16 h-auto drop-shadow-sm group-hover:rotate-6 transition-transform"
                      />
                      <span className="font-body text-xs md:text-sm text-[#69358C] text-center leading-tight mt-1">
                        {dayEvent.title}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Modal de Registro */}
      {selectedEvent && (
        <RsvpModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}

      {/* Onda de Transición */}
      <div className="w-full overflow-hidden leading-none mt-8 -mb-1">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 sm:h-16 md:h-20"
        >
          <path
            d="M0,0 C150,90 350,-50 500,40 C650,110 850,0 1000,30 C1100,65 1170,40 1200,30 L1200,90 L0,120 Z"
            fill="#0B0089"
            stroke="#69358C"
            strokeWidth="5"
          />
          <path
            d="M0,60 C150,105 350,-15 500,55 C650,150 850,25 1000,65 C1100,85 1170,55 1200,80 L1200,120 L0,120 Z"
            fill="#DB37B4"
            stroke="#69358C"
            strokeWidth="5"
          />
          <path
            d="M0,115 C150,120 350,0 500,70 C650,180 850,40 1000,80 C1100,100 1170,70 1200,115 L1200,135 L0,120 Z"
            fill="#FFFDF6"
            stroke="#69358C"
            strokeWidth="5"
          />
        </svg>
      </div>

    </section>
  );
}