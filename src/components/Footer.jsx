import React from 'react';
import { Phone, Mail, MapPin, Clock, User } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest py-12 border-t border-white/5 mt-auto text-on-surface">
      <div className="max-w-[1200px] mx-auto px-6 md:px-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
          
          {/* Column 1: CONTÁCTANOS */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-primary font-jakarta font-semibold tracking-widest text-sm mb-6 uppercase">
              Contáctanos
            </h3>
            <div className="flex flex-col space-y-4 text-sm text-on-surface-variant font-jakarta items-center md:items-start">
              <a href="tel:+584247004492" className="flex items-center gap-3 hover:text-primary transition-colors group">
                <Phone size={18} className="text-primary group-hover:text-primary-container transition-colors shrink-0" />
                <span>+58 414-376-8876</span>
              </a>
              <a href="tel:+584247344904" className="flex items-center gap-3 hover:text-primary transition-colors group">
                <Phone size={18} className="text-primary group-hover:text-primary-container transition-colors shrink-0" />
                <span>+58 414-759-3330</span>
              </a>
              <a href="mailto:infobebidastipicasve@gmail.com" className="flex items-center gap-3 hover:text-primary transition-colors group">
                <Mail size={18} className="text-primary group-hover:text-primary-container transition-colors shrink-0" />
                <span>lacasonadisco@gmail.com</span>
              </a>
              <div className="flex items-start gap-3 group text-center md:text-left">
                <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                <span className="leading-relaxed">
                  Capacho Nuevo, Estado Táchira<br />Venezuela
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: SÍGUENOS */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-primary font-jakarta font-semibold tracking-widest text-sm mb-6 uppercase">
              Síguenos
            </h3>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                <FacebookIcon size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                <InstagramIcon size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                <TwitterIcon size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                <YoutubeIcon size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                <TikTokIcon size={18} />
              </a>
            </div>
          </div>

          {/* Column 3: INFORMACIÓN */}
          <div className="flex flex-col items-center md:items-end">
            <div className="flex flex-col items-center md:items-start w-full md:w-auto">
              <h3 className="text-primary font-jakarta font-semibold tracking-widest text-sm mb-6 uppercase text-center md:text-left w-full">
                Información
              </h3>
              <div className="flex flex-col space-y-4 text-sm text-on-surface-variant font-jakarta w-full">
                <div className="flex items-start gap-3 justify-center md:justify-start">
                  <Clock size={18} className="text-primary mt-0.5 shrink-0" />
                  <div className="text-left">
                    <span className="block">Lunes a Viernes</span>
                    <span className="block">9:00 AM - 6:00 PM</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <User size={18} className="text-primary shrink-0" />
                  <span>Francisco Rincón - Programador</span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <User size={18} className="text-primary shrink-0" />
                  <span>Edgar Rivas - Programador</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-outline-variant/30 pt-8 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-jakarta text-on-surface-variant mb-2">
            &copy; {new Date().getFullYear()} La Casona Fiesta. Todos los derechos reservados.
          </p>
          <p className="text-xs font-jakarta text-on-surface-variant">
            Desarrollado por el equipo de Francisco y Alejo.
          </p>
        </div>

      </div>
    </footer>
  );
}

const FacebookIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

const TwitterIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const YoutubeIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 7.1C2.5 7.1 2.3 5.3 3.1 4.5 4.1 3.5 5.2 3.5 5.8 3.4 8.5 3.2 12 3.2 12 3.2s3.5 0 6.2.2c.5.1 1.7.1 2.7 1.1.8.8 1 2.6 1 2.6s.2 2.1.2 4.2v1.4c0 2.1-.2 4.2-.2 4.2s-.2 1.8-1 2.6c-1 1-2.3 1-2.9 1.1-3.1.3-6.1.2-6.1.2s-3.5 0-6.2-.2c-.5-.1-1.7-.1-2.7-1.1-.8-.8-1-2.6-1-2.6s-.2-2.1-.2-4.2V11.3c0-2.1.2-4.2.2-4.2z"></path>
    <path d="M9.7 15.6V8l6.4 3.8-6.4 3.8z"></path>
  </svg>
);

const TikTokIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);
