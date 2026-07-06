import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getVenues } from '../services/api';
import { StrobeBackground } from '../components/StrobeBackground';
import { SideDecorations } from '../components/SideDecorations';

export function AreasSection() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await getVenues();
        const data = response.data || response;
        setAreas(data);
      } catch (err) {
        setError('No se pudieron cargar las áreas');
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  return (
    <section id="zonas" className="py-16 bg-background relative z-10">
      <SideDecorations />
      <StrobeBackground />
      <div className="max-w-[1200px] mx-auto px-6 md:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-2 tracking-wide uppercase">Nuestras Áreas de Fiesta</h2>
          <p className="font-jakarta text-on-surface-variant text-sm mb-16">Espacios exclusivos adaptados a tu estilo.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {loading ? (
             Array.from({ length: 2 }).map((_, index) => (
               <motion.div 
                 key={index}
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-50px" }}
                 transition={{ duration: 0.6, delay: index * 0.2 }}
                 className="h-full"
               >
                 <Card className="bg-surface-container-low/30 border-white/5 flex flex-col h-full animate-pulse">
                   <div className="relative h-64 overflow-hidden rounded-t-md p-4 flex items-center justify-center bg-surface-variant/30">
                     <Loader2 className="animate-spin text-white/20" size={48} />
                   </div>
                 </Card>
               </motion.div>
             ))
          ) : error ? (
             <div className="col-span-1 md:col-span-2 text-center py-10 text-error font-jakarta">
               {error}
             </div>
          ) : areas.length === 0 ? (
             <div className="col-span-1 md:col-span-2 text-center py-10 text-on-surface-variant font-jakarta">
               No hay áreas disponibles por el momento.
             </div>
          ) : (
            areas.map((area, index) => (
              <motion.div 
                key={area.venue_id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="h-full"
              >
                <Card className="bg-surface-container-low/30 border-white/5 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300 group">
                  <div className="relative h-64 overflow-hidden rounded-t-md p-4">
                     <img src={area.image_url || '/assets/casona11.jpeg'} alt={area.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
                     {/* Content positioned over image at bottom */}
                     <div className="absolute bottom-6 left-6 right-6">
                        <span className="inline-block px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold font-jakarta tracking-wider mb-3 backdrop-blur-md">
                          Aforo: {area.capacity}+
                        </span>
                        <h3 className="font-playfair text-2xl font-bold text-white mb-2">{area.name}</h3>
                        <p className="font-jakarta text-on-surface-variant text-sm mb-4 line-clamp-2">
                          {area.description || 'Espacio exclusivo para eventos inolvidables.'}
                        </p>
                     </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
