import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Loader2 } from 'lucide-react';
import { getEvents } from '../services/api';

export function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        const data = response.data || response;
        
        // Formatear la fecha para que se vea como en el diseño original
        const formattedEvents = data.map(event => {
          const dateObj = new Date(event.start_date);
          const formatter = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: '2-digit', month: 'short' });
          let dateStr = formatter.format(dateObj);
          // Capitalizar la primera letra
          dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
          
          return {
            ...event,
            formattedDate: dateStr
          };
        });
        
        setEvents(formattedEvents);
      } catch (err) {
        setError('No se pudieron cargar los eventos');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <section id="eventos" className="py-24 bg-background">
      <div className="max-w-[1200px] mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">Próximos Eventos</h2>
            <p className="text-on-surface-variant font-jakarta text-lg">La agenda más exclusiva de la ciudad.</p>
          </div>
          <Button variant="outline">Ver Calendario Completo</Button>
        </div>

        <div className="flex flex-col">
          {loading ? (
             <div className="flex justify-center py-12">
               <Loader2 className="animate-spin text-white/20" size={48} />
             </div>
          ) : error ? (
             <div className="text-center py-10 text-error font-jakarta">
               {error}
             </div>
          ) : events.length === 0 ? (
             <div className="text-center py-10 text-on-surface-variant font-jakarta">
               No hay eventos programados por ahora.
             </div>
          ) : (
            events.map((event, index) => (
              <div 
                key={event.event_id}
                className={`flex flex-col md:flex-row items-center gap-6 py-8 border-t border-white/[0.08] group ${index === events.length - 1 ? 'border-b' : ''}`}
              >
                {/* Date */}
                <div className="w-full md:w-48 text-primary font-jakarta font-semibold tracking-widest uppercase text-sm">
                  {event.formattedDate || 'Pronto'}
                </div>
                
                {/* Event Info */}
                <div className="w-full md:flex-1">
                  <h3 className="font-playfair text-2xl md:text-3xl text-white font-bold mb-2 group-hover:text-primary transition-colors">
                    {event.title || event.type_event}
                  </h3>
                  <p className="text-on-surface-variant font-jakarta">{event.dj || 'Special Guest'}</p>
                </div>

                {/* Action */}
                <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6 mt-4 md:mt-0">
                  <div className="w-20 h-20 rounded-md overflow-hidden hidden lg:block border border-white/10 bg-surface-variant/30">
                    <img 
                      src={event.image_url || '/assets/casona12.jpeg'} 
                      alt={event.title || event.type_event} 
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                  <Button variant="secondary" className="px-8 w-full md:w-auto">
                    Tickets
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
