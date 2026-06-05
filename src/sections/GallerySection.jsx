import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function GallerySection() {
  const scrollRef = useRef(null);

  const images = [
    { id: 1, src: '/assets/casona3.jpeg' },
    { id: 2, src: '/assets/casona4.jpeg' },
    { id: 3, src: '/assets/casona6.jpeg' },
    { id: 4, src: '/assets/casona9.jpeg' },
    { id: 5, title: '', src: '/assets/casona12.jpeg' },
    { id: 6, title: '', src: '/assets/casona13.jpeg' },
    { id: 7, title: '', src: '/assets/casona14.jpeg' },
    { id: 8, title: '', src: '/assets/casona15.jpeg' },
    { id: 9, title: '', src: '/assets/casona16.jpeg' },
    { id: 10, title: '', src: '/assets/casona17.jpeg' },
    { id: 11, title: '', src: '/assets/casona18.jpeg' },
    { id: 12, title: '', src: '/assets/casona19.jpeg' }
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
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
          scrollRef.current.scrollBy({ left: 600, behavior: 'smooth' });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="galeria" className="py-16 bg-background relative z-10">
      <div className="max-w-[1200px] mx-auto px-6 md:px-16">
        <div className="flex items-end justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-2 uppercase tracking-wide">Galería de Eventos</h2>
            <p className="font-jakarta text-on-surface-variant text-sm">Momentos inolvidables capturados en La Casona.</p>
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
          className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map(img => (
            <div 
              key={img.id} 
              className="min-w-[100%] md:min-w-[calc(50%-12px)] h-64 md:h-80 relative rounded-2xl overflow-hidden border border-white/5 group snap-start shrink-0"
            >
              <img src={img.src} alt="Galería" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
