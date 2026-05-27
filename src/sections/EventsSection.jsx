import React from 'react';
import { Button } from '../components/Button';

export function EventsSection() {
  const events = [
    {
      id: 1,
      date: 'Viernes, 28 Oct',
      title: 'Neon Nights vol. 4',
      dj: 'DJ Snake & Guests',
      image: '/src/assets/casona12.jpeg',
    },
    {
      id: 2,
      date: 'Sábado, 29 Oct',
      title: 'Halloween Masquerade',
      dj: 'Especial Edition',
      image: '/src/assets/casona13.jpeg',
    },
    {
      id: 3,
      date: 'Viernes, 04 Nov',
      title: 'Deep House Sessions',
      dj: 'Martinez Brothers',
      image: '/src/assets/casona14.jpeg',
    }
  ];

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
          {events.map((event, index) => (
            <div 
              key={event.id}
              className={`flex flex-col md:flex-row items-center gap-6 py-8 border-t border-white/[0.08] group ${index === events.length - 1 ? 'border-b' : ''}`}
            >
              {/* Date */}
              <div className="w-full md:w-48 text-primary font-jakarta font-semibold tracking-widest uppercase text-sm">
                {event.date}
              </div>
              
              {/* Event Info */}
              <div className="w-full md:flex-1">
                <h3 className="font-playfair text-2xl md:text-3xl text-white font-bold mb-2 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <p className="text-on-surface-variant font-jakarta">{event.dj}</p>
              </div>

              {/* Action */}
              <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6 mt-4 md:mt-0">
                <div className="w-20 h-20 rounded-md overflow-hidden hidden lg:block border border-white/10">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                <Button variant="secondary" className="px-8 w-full md:w-auto">
                  Tickets
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
