import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function ServicesSection() {
  const scrollRef = useRef(null);

  const services = [
    { id: 1, title: 'Show de Garotas', image: '/src/assets/garota.jpeg' },
    { id: 2, title: 'DJ Profesional', image: '/src/assets/dj.jpg' },
    { id: 3, title: 'Robots LED', image: '/src/assets/robot.jpeg' },
    { id: 4, title: 'Cantantes en Vivo', image: '/src/assets/cantante.png' },
    { id: 5, title: 'Show de Luces y Pantallas', image: '/src/assets/miniteca.png' },
    { id: 6, title: 'Chefs profesionales', image: '/src/assets/chef.webp' },
    { id: 7, title: 'Decoración Temática', image: '/src/assets/casona7.jpeg' },
    { id: 8, title: 'Show de disfraces', image: '/src/assets/disfraz.png' }
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="servicios" className="py-16 bg-background relative z-10">
      <div className="max-w-[1200px] mx-auto px-6 md:px-16">
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-2 uppercase tracking-wide">Servicios que Ofrecemos</h2>
            <p className="font-jakarta text-on-surface-variant text-sm">Entretenimiento garantizado para tu evento.</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </motion.div>
        </div>

        <motion.div 
          ref={scrollRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {services.map(service => (
            <div key={service.id} className="min-w-[200px] md:min-w-[240px] h-56 relative rounded-xl overflow-hidden group cursor-pointer border border-white/5 snap-start shrink-0">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <span className="font-jakarta font-bold text-white bg-surface/50 backdrop-blur-md px-4 py-1.5 rounded-full text-xs inline-block border border-white/10">
                  {service.title}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
