import React, { useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TiltCard } from '../components/TiltCard';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { StrobeBackground } from '../components/StrobeBackground';
import { SideDecorations } from '../components/SideDecorations';

export function GallerySection() {
  const scrollRef = useRef(null);
  const isPaused = useRef(false);
  const animFrameRef = useRef(null);
  const SPEED = 0.6; // px por frame
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!selectedImage) return;
    const handleKey = (e) => { if (e.key === 'Escape') setSelectedImage(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedImage]);

  const images = [
    { id: 1, src: '/assets/casona3.jpeg' },
    { id: 2, src: '/assets/casona4.jpeg' },
    { id: 3, src: '/assets/casona6.jpeg' },
    { id: 4, src: '/assets/casona9.jpeg' },
    { id: 5, src: '/assets/casona12.jpeg' },
    { id: 6, src: '/assets/casona13.jpeg' },
    { id: 7, src: '/assets/casona14.jpeg' },
    { id: 8, src: '/assets/casona15.jpeg' },
    { id: 9, src: '/assets/casona16.jpeg' },
    { id: 10, src: '/assets/casona17.jpeg' },
    { id: 11, src: '/assets/casona18.jpeg' },
    { id: 12, src: '/assets/casona19.jpeg' },
  ];

  // Duplicar para efecto de loop infinito
  const allImages = [...images, ...images];

  const startScroll = useCallback(() => {
    const step = () => {
      const el = scrollRef.current;
      if (el && !isPaused.current) {
        el.scrollLeft += SPEED;
        // Cuando llegamos a la mitad (el set duplicado), volvemos al inicio sin salto visible
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        }
      }
      animFrameRef.current = requestAnimationFrame(step);
    };
    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    startScroll();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [startScroll]);

  const scrollManual = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    isPaused.current = true;
    const cardWidth = el.clientWidth * 0.5 + 24;
    el.scrollBy({ left: direction === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' });
    // Reanudar scroll automático después de 1.5s
    setTimeout(() => { isPaused.current = false; }, 1500);
  };

  return (
    <><section id="galeria" className="py-16 bg-background relative z-10">
      <SideDecorations />
      <StrobeBackground />
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
            className="hidden md:flex gap-2"
          >
            <button
              onClick={() => scrollManual('left')}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white bg-surface-container-highest/30 backdrop-blur-md hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollManual('right')}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white bg-surface-container-highest/30 backdrop-blur-md hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div
            ref={scrollRef}
            onMouseEnter={() => { isPaused.current = true; }}
            onMouseLeave={() => { isPaused.current = false; }}
            className="flex gap-6 overflow-x-auto pb-6 pt-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
            }}
          >
            {allImages.map((img, index) => (
              <TiltCard
                key={index}
                className="w-[85vw] md:w-[45vw] h-64 md:h-80 relative rounded-2xl overflow-hidden border border-white/5 group shrink-0"
              >
                <img
                  src={img.src}
                  alt="Galería"
                  onClick={() => setSelectedImage(img.src)}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 cursor-pointer"
                />
              </TiltCard>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
    {/* Lightbox */}
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-8"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative inline-flex" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black/90 transition-all z-10"
            >
              <X size={18} />
            </button>
            <motion.img
              key={selectedImage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={selectedImage}
              alt="Galería"
              className="max-w-[80vw] max-h-[70vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
  );
}
