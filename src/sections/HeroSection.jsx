import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    '/assets/casona11.jpeg',
    '/assets/casona8.jpeg',
    '/assets/casona16.jpeg',
    '/assets/casona24.jpeg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {images.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-40' : 'opacity-0'
            }`}
          >
            <img 
              src={src} 
              alt={`Fondo de Casona ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Gradient overlays to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background"></div>
      </div>

      {/* Background Radial Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] opacity-70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-16 text-center pt-20">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-playfair text-5xl md:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
          Tus Eventos. Tu Momento
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-jakarta text-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
          Planifica tu evento de inicio a fin. Desde el espacio perfecto hasta los detalles más exquisitos.
          Nos encargamos de todo para que disfrutes tu noche de lujo sin preocupaciones.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center">
          <Button 
            variant="primary" 
            className="flex items-center gap-2 pr-4"
            onClick={() => {
              const el = document.getElementById('zonas');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Comenzar <ArrowRight size={18} />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
