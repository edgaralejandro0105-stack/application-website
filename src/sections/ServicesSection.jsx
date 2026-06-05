import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getServices } from '../services/api';

export function ServicesSection() {
  const scrollRef = useRef(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices();
        const data = response.data || response;
        // Solo mostramos los servicios activos
        const activeServices = data.filter(service => service.is_active);
        setServices(activeServices);
      } catch (err) {
        setError('No se pudieron cargar los servicios');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && !loading && services.length > 0) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [loading, services]);

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
          {loading ? (
             Array.from({ length: 5 }).map((_, i) => (
               <div key={i} className="min-w-[200px] md:min-w-[240px] h-56 rounded-xl border border-white/5 bg-surface-variant/30 animate-pulse shrink-0 flex items-center justify-center">
                 <Loader2 className="animate-spin text-white/20" size={32} />
               </div>
             ))
          ) : error ? (
             <div className="w-full text-center py-10 text-error font-jakarta">
               {error}
             </div>
          ) : services.length === 0 ? (
             <div className="w-full text-center py-10 text-on-surface-variant font-jakarta">
               No hay servicios disponibles por ahora.
             </div>
          ) : (
            services.map(service => (
              <div key={service.service_id} className="min-w-[200px] md:min-w-[240px] h-56 relative rounded-xl overflow-hidden group cursor-pointer border border-white/5 snap-start shrink-0">
                <img src={service.image_url || '/assets/dj.jpg'} alt={service.name || service.service_type} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent"></div>
                
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-center transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                  <span className="font-jakarta font-bold text-white bg-surface/50 backdrop-blur-md px-4 py-1.5 rounded-full text-xs inline-block mx-auto border border-white/10 mb-2 transition-transform duration-300 group-hover:-translate-y-2">
                    {service.service_type}
                  </span>
                  
                  {/* Info extra revelada al hacer hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 h-0 group-hover:h-auto">
                    {service.base_price && parseFloat(service.base_price) > 0 && (
                      <p className="text-primary font-jakarta text-xs font-semibold mb-1">
                        Desde ${parseFloat(service.base_price).toFixed(2)}
                      </p>
                    )}
                    {service.description && (
                      <p className="text-white/80 font-jakarta text-[10px] line-clamp-2">
                        {service.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
}
