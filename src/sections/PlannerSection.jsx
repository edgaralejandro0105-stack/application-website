import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ChevronDown, Calendar } from 'lucide-react';

export function PlannerSection() {
  return (
    <section id="planificador" className="py-24 bg-background relative z-10">
      <div className="max-w-[1200px] mx-auto px-6 md:px-16">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-2 uppercase tracking-wide">Planifica tu Evento</h2>
          <p className="font-jakarta text-on-surface-variant text-sm">Déjanos los detalles a nosotros. Listos para empezar?</p>
        </div>

        <Card className="max-w-4xl mx-auto p-8 border-white/10 bg-surface-container-low/40">
          <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
            
            {/* Top Row: Selects & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Tipo de Salón</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary">
                    <option>Salón</option>
                    <option>Terraza</option>
                    <option>Ambos</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Horario Reserva</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary">
                    <option>Noche (20:00 - 03:00)</option>
                    <option>Tarde (14:00 - 21:00)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Fecha</label>
                <div className="relative">
                  <input type="date" className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer cursor-pointer" />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none" size={18} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Tipo de evento</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary">
                    <option>Bodas</option>
                    <option>Cumpleaños / 15 Años</option>
                    <option>Corporativo</option>
                    <option>Infantil</option>
                    <option>Otro</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
                </div>
              </div>
            </div>

            {/* Middle: Text Input */}
            <div className="flex flex-col gap-2">
              <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Descripción del evento</label>
              <input type="text" className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary" />
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-jakarta font-semibold text-white mb-4">Servicios Requeridos</h4>
                <div className="flex flex-col gap-3">
                  {['Show de garotas', 'Robots LED', 'Show de Luces y Pantallas'].map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="w-4 h-4 rounded-full border border-outline flex items-center justify-center peer-checked:border-primary">
                        <div className="w-2 h-2 rounded-full bg-transparent peer-checked:bg-primary"></div>
                      </div>
                      <span className="text-sm font-jakarta text-on-surface-variant">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="h-4 mb-4"></div> {/* Spacer for alignment */}
                <div className="flex flex-col gap-3">
                  {['DJ', 'Show de Cotillón'].map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="w-4 h-4 rounded-full border border-outline flex items-center justify-center peer-checked:border-primary">
                        <div className="w-2 h-2 rounded-full bg-transparent peer-checked:bg-primary"></div>
                      </div>
                      <span className="text-sm font-jakarta text-on-surface-variant">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
               <div>
                <h4 className="text-sm font-jakarta font-semibold text-white mb-4">Personal Requerido</h4>
                <div className="flex flex-col gap-3">
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="w-4 h-4 rounded-full border border-outline flex items-center justify-center peer-checked:border-primary shrink-0">
                        <div className="w-2 h-2 rounded-full bg-transparent peer-checked:bg-primary"></div>
                      </div>
                      <span className="text-sm font-jakarta text-on-surface-variant flex-1">Mesoneros</span>
                      <input type="number" min="0" placeholder="0" className="w-16 bg-surface-container-highest/50 border border-outline-variant rounded-md px-2 py-1 text-on-surface text-center focus:outline-none focus:border-primary text-sm" onClick={e => e.stopPropagation()} />
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="w-4 h-4 rounded-full border border-outline flex items-center justify-center peer-checked:border-primary shrink-0">
                        <div className="w-2 h-2 rounded-full bg-transparent peer-checked:bg-primary"></div>
                      </div>
                      <span className="text-sm font-jakarta text-on-surface-variant flex-1">Barman</span>
                      <input type="number" min="0" placeholder="0" className="w-16 bg-surface-container-highest/50 border border-outline-variant rounded-md px-2 py-1 text-on-surface text-center focus:outline-none focus:border-primary text-sm" onClick={e => e.stopPropagation()} />
                   </label>
                </div>
              </div>
              <div>
                 <div className="h-4 mb-4"></div> {/* Spacer */}
                 <div className="flex flex-col gap-3">
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="w-4 h-4 rounded-full border border-outline flex items-center justify-center peer-checked:border-primary shrink-0">
                        <div className="w-2 h-2 rounded-full bg-transparent peer-checked:bg-primary"></div>
                      </div>
                      <span className="text-sm font-jakarta text-on-surface-variant flex-1">Seguridad</span>
                      <input type="number" min="0" placeholder="0" className="w-16 bg-surface-container-highest/50 border border-outline-variant rounded-md px-2 py-1 text-on-surface text-center focus:outline-none focus:border-primary text-sm" onClick={e => e.stopPropagation()} />
                   </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <Button variant="primary" type="submit" className="px-12">
                Reservar
              </Button>
            </div>
            
          </form>
        </Card>
      </div>
    </section>
  );
}
