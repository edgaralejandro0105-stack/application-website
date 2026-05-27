import React from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function LoginSection() {
  return (
    <section id="reservas" className="py-24 relative bg-surface-container-lowest overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-16 relative z-10 flex justify-center">
        <Card className="w-full max-w-md p-8 md:p-10 border-t border-white/20 bg-surface/40">
          <div className="text-center mb-8">
            <h2 className="font-playfair text-3xl font-bold text-white mb-2">Acceso VIP</h2>
            <p className="text-on-surface-variant font-jakarta text-sm">Inicia sesión o regístrate para gestionar tus reservas y mesas.</p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <Input label="Correo Electrónico" type="email" id="email" placeholder="tu@email.com" />
            <Input label="Contraseña" type="password" id="password" placeholder="••••••••" />
            
            <div className="flex justify-between items-center text-sm font-jakarta mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-on-surface-variant hover:text-primary transition-colors">
                <input type="checkbox" className="accent-primary rounded bg-surface border-outline" />
                Recordarme
              </label>
              <a href="#" className="text-primary hover:text-primary-fixed hover:underline transition-all">¿Olvidaste tu contraseña?</a>
            </div>

            <Button variant="primary" className="w-full mt-4" type="submit">
              Ingresar
            </Button>
            
            <div className="text-center mt-4 text-sm font-jakarta text-on-surface-variant">
              ¿No tienes cuenta? <a href="#" className="text-primary font-semibold hover:underline">Solicitar Membresía</a>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}
