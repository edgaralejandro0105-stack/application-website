import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function GlassNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#' },
    { name: 'Zonas', href: '#zonas' },
    { name: 'Productos', href: '#productos' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Galería', href: '#galeria' },
    { name: 'Planificador', href: '#planificador' },
  ];

  const handleAction = (action) => {
    setMobileMenuOpen(false);
    const el = document.getElementById('planificador');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Esperamos a que termine el scroll para cambiar el tab
      setTimeout(() => {
        window.dispatchEvent(new Event(action));
      }, 500);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${scrolled || mobileMenuOpen ? 'bg-surface/90 backdrop-blur-[20px] py-3 border-white/10' : 'bg-transparent py-5 border-transparent'}`}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/assets/casona_logo_2.png" alt="La Casona Fiestas" className={`w-auto transition-all duration-500 ${scrolled || mobileMenuOpen ? 'h-20' : 'h-28'}`} />
        </div>
        
        {/* Enlaces de Desktop */}
        <div className="hidden lg:flex items-center gap-8 font-jakarta text-sm font-medium text-on-surface-variant">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary/50">
              {link.name}
            </a>
          ))}
        </div>

        {/* Botones de Desktop */}
        <div className="hidden lg:flex items-center gap-6">
          <button 
            onClick={(e) => {
              e.preventDefault();
              handleAction('open-consulta');
            }} 
            className="text-xs font-medium text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            ¿Ya agendaste? Consulta aquí
          </button>
          
          <Button 
            variant="primary" 
            onClick={() => handleAction('open-reserva')}
          >
            Reserva
          </Button>
        </div>

        {/* Botón Hamburger Mobile */}
        <button 
          className="lg:hidden text-white p-2" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú Desplegable Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full bg-surface/95 backdrop-blur-[20px] border-b border-white/10 flex flex-col items-center py-8 gap-6 shadow-2xl h-screen overflow-y-auto pb-32"
          >
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-white font-playfair text-xl hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            
            <div className="w-full h-px bg-white/10 my-2"></div>
            
            <button 
              onClick={(e) => {
                e.preventDefault();
                handleAction('open-consulta');
              }} 
              className="text-on-surface-variant text-sm font-jakarta font-medium hover:text-primary transition-colors underline underline-offset-4"
            >
              ¿Ya agendaste? Consulta tu reserva aquí
            </button>
            
            <Button 
              variant="primary" 
              className="w-3/4 max-w-xs py-4 text-base mt-2"
              onClick={() => handleAction('open-reserva')}
            >
              Reservar Ahora
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
