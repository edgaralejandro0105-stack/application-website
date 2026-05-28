import React from 'react';
import { Card } from '../components/Card';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function AreasSection() {
  const areas = [
    {
      id: 1,
      title: 'Salón',
      capacity: 'Aforo: 80+',
      description: 'Nuestro espacio principal, ideal para eventos de gran magnitud. Cuenta con escenario integrado.',
      image: '/src/assets/casona11.jpeg'
    },
    {
      id: 2,
      title: 'Terraza',
      capacity: 'Aforo: 100+',
      description: 'Un oasis al aire libre, perfecto para recepciones. Disfruta de un ambiente relajado con vistas a la naturaleza capachense.',
      image: '/src/assets/casona5.jpeg'
    }
  ];

  return (
    <section id="zonas" className="py-24 bg-background relative z-10">
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
          {areas.map((area, index) => (
            <motion.div 
              key={area.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="h-full"
            >
              <Card className="bg-surface-container-low/30 border-white/5 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300 group">
                <div className="relative h-64 overflow-hidden rounded-t-md p-4">
                   <img src={area.image} alt={area.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
                   {/* Content positioned over image at bottom */}
                   <div className="absolute bottom-6 left-6 right-6">
                      <span className="inline-block px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold font-jakarta tracking-wider mb-3 backdrop-blur-md">
                        {area.capacity}
                      </span>
                      <h3 className="font-playfair text-2xl font-bold text-white mb-2">{area.title}</h3>
                      <p className="font-jakarta text-on-surface-variant text-sm mb-4 line-clamp-2">
                        {area.description}
                      </p>
                   </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
