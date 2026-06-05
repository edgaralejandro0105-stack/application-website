import React, { useState, useEffect } from 'react';
import { Button } from './Button';

export function GlassNavbar() {
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-surface/80 backdrop-blur-[20px] py-3 border-white/10' : 'bg-transparent py-5 border-transparent'}`}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/assets/casona_logo_2.png" alt="La Casona Fiestas" className={`w-auto transition-all duration-500 ${scrolled ? 'h-20' : 'h-28'}`} />
        </div>
        
        <div className="hidden lg:flex items-center gap-8 font-jakarta text-sm font-medium text-on-surface-variant">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary/50">
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new Event('open-consulta'));
            }} 
            className="hidden lg:block text-xs font-medium text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            ¿Ya agendaste? Consulta aquí
          </button>
          
          <Button 
            variant="primary" 
            className="hidden md:inline-flex"
            onClick={() => {
              const el = document.getElementById('planificador');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              window.dispatchEvent(new Event('open-reserva'));
            }}
          >
            Reserva
          </Button>
        </div>
      </div>
    </nav>
  );
}
