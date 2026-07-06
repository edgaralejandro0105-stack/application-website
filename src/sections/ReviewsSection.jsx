import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card } from '../components/Card';
import { SideDecorations } from '../components/SideDecorations';

// Simulated data until backend integration
const mockReviews = [
  {
    id: 1,
    name: "María Gómez",
    type: "Boda de Plata",
    rating: 5,
    text: "La atención fue impecable desde el primer día. El salón estaba hermoso y la comida superó nuestras expectativas. ¡Una noche inolvidable!",
    date: "Hace 2 semanas"
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    type: "Evento Corporativo",
    rating: 5,
    text: "Organizamos el aniversario de nuestra empresa aquí. El equipo de logística se encargó de todo. Altamente recomendado para empresas.",
    date: "Hace 1 mes"
  },
  {
    id: 3,
    name: "Familia Silva",
    type: "Quinceaños",
    rating: 4,
    text: "Un lugar mágico. La decoración y la iluminación hicieron que las fotos quedaran espectaculares. Solo el estacionamiento estuvo algo lleno.",
    date: "Hace 2 meses"
  },
  {
    id: 4,
    name: "Andrea & Luis",
    type: "Matrimonio",
    rating: 5,
    text: "El mejor día de nuestras vidas. El planificador nos ayudó con cada detalle, no tuvimos que preocuparnos de absolutamente nada. 10/10.",
    date: "Hace 3 meses"
  },
  {
    id: 5,
    name: "Grupo Empresarial X",
    type: "Fiesta de Fin de Año",
    rating: 5,
    text: "Excelente servicio de catering y sonido. Todo nuestro equipo quedó fascinado con el lugar. Seguro volveremos el próximo año.",
    date: "Hace 4 meses"
  }
];

export function ReviewsSection() {
  return (
    <section id="testimonios" className="py-20 bg-background relative z-10 overflow-hidden">
      <SideDecorations />
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/3"></div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-16 text-center mb-12 relative z-10">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4 uppercase tracking-wide">
          Experiencias Inolvidables
        </h2>
        <p className="font-jakarta text-on-surface-variant max-w-2xl mx-auto">
          No te lo decimos nosotros, te lo cuentan quienes ya vivieron su momento de lujo con nosotros.
        </p>
      </div>

      <div className="relative z-10 w-full pb-8">
        {/* Gradients to fade out edges of the marquee */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none"></div>

        <div className="flex w-full overflow-hidden">
          <div className="animate-marquee gap-6 pr-6 pb-4 pt-4">
            {[...mockReviews, ...mockReviews].map((review, idx) => (
              <Card 
                key={`${review.id}-${idx}`} 
                className="w-[350px] p-6 bg-surface-container/40 border border-white/5 hover:border-primary/30 transition-all duration-300 flex flex-col shrink-0 group relative overflow-hidden"
              >
                {/* Subtle hover glow inside card */}
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none"></div>
                
                <Quote className="text-primary/30 mb-4 absolute top-4 right-4" size={40} />
                
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < review.rating ? "fill-secondary text-secondary" : "fill-surface-variant text-surface-variant"} 
                    />
                  ))}
                </div>
                
                <p className="font-jakarta text-white/90 text-sm mb-6 flex-1 italic leading-relaxed relative z-10">
                  "{review.text}"
                </p>
                
                <div className="mt-auto border-t border-white/10 pt-4 relative z-10">
                  <h4 className="font-playfair font-bold text-white text-lg">{review.name}</h4>
                  <div className="flex justify-between items-center text-xs font-jakarta mt-1">
                    <span className="text-primary">{review.type}</span>
                    <span className="text-on-surface-variant/70">{review.date}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
