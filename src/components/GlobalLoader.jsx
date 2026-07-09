import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  'Preparando los salones…',
  'Afinando el equipo de sonido…',
  'Decorando los espacios…',
  'Organizando la fiesta…',
  'Calentando los motores…',
  'Ultimando los detalles…',
  'Ajustando la iluminación…',
  'Revisando el menú…',
];

export function GlobalLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8 px-4">
        <motion.img
          src="/assets/casona_logo_1.png"
          alt="La Casona"
          className="w-32 h-32 md:w-40 md:h-40 object-contain"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        <div className="w-48 h-1 rounded-full bg-surface-container-high overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          />
        </div>

        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={messages[index]}
              className="font-jakarta text-on-surface-variant text-sm md:text-base text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {messages[index]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
