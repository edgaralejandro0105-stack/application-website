import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { getEvents } from '../services/api';

export function AvailabilityCalendar({ value, onChange, onClose }) {
  const [currentDate, setCurrentDate] = useState(value ? new Date(`${value}T00:00:00`) : new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        const data = response.data || response;
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load events for calendar', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const nextMonth = (e) => {
    e.preventDefault();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = (e) => {
    e.preventDefault();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleSelectDate = (day) => {
    if (!day || isBooked(day) || isPast(day)) return;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (onChange) {
      onChange(dateStr);
    }
    if (onClose) {
      onClose();
    }
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  // Create array for days
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isBooked = (day) => {
    if (!day) return false;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some(ev => ev.event_date && ev.event_date.startsWith(dateStr));
  };

  const isPast = (day) => {
    if (!day) return true;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="bg-surface-container-low/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 shadow-2xl relative overflow-hidden w-[calc(100vw-3rem)] sm:w-[340px] max-w-[340px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-playfair text-lg text-white flex items-center gap-2">
          <CalendarIcon className="text-primary" size={18} />
          Selecciona tu Fecha
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 text-on-surface-variant hover:text-white transition-colors">
            <ChevronLeft size={18} />
          </button>
          <span className="font-jakarta font-semibold text-white text-sm min-w-[90px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={nextMonth} className="p-1 text-on-surface-variant hover:text-white transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-[10px] font-jakarta text-on-surface-variant uppercase tracking-wider py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {loading ? (
          <div className="col-span-7 flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : (
          days.map((day, idx) => {
            const booked = isBooked(day);
            const past = isPast(day);
            const dateStr = day ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
            const isSelected = value === dateStr;
            
            return (
              <div 
                key={idx} 
                onClick={() => handleSelectDate(day)}
                className={`
                  aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-jakarta transition-all relative
                  ${!day ? 'bg-transparent' : 
                    booked ? 'bg-error/10 text-error border border-error/20 cursor-not-allowed opacity-50' : 
                    past ? 'bg-surface-variant/20 text-on-surface-variant/50 cursor-not-allowed opacity-50' :
                    isSelected ? 'bg-primary text-on-primary font-bold shadow-[0_0_15px_rgba(208,188,255,0.4)]' :
                    'bg-surface-container-highest/50 text-white hover:bg-primary/20 hover:border-primary/50 cursor-pointer'}
                `}
                title={booked ? 'Fecha ocupada' : !past && day ? 'Fecha disponible' : ''}
              >
                {day}
                {day && !past && (
                  <div className={`w-1 h-1 rounded-full absolute bottom-1 ${booked ? 'bg-error' : isSelected ? 'bg-on-primary' : 'bg-secondary'}`}></div>
                )}
              </div>
            );
          })
        )}
      </div>
      
      <div className="flex gap-4 mt-6 justify-center text-xs font-jakarta">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-secondary"></div>
          <span className="text-on-surface-variant text-[10px] uppercase">Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-error"></div>
          <span className="text-on-surface-variant text-[10px] uppercase">Ocupado</span>
        </div>
      </div>
    </div>
  );
}
