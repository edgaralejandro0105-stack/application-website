import React, { useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { ChevronDown, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '../Button';

function AnimatedNumber({ value }) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString('en-US'));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

export function PlannerReserva({ logic }) {
  const {
    step,
    setStep,
    isSubmitting,
    formData,
    setFormData,
    availableVenues,
    availableServices,
    handleServiceChange,
    handlePersonalChange,
    precioEstimado,
    handleSubmit
  } = logic;

  return (
    <motion.form key="reserva-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex flex-col gap-8" onSubmit={handleSubmit}>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Tipo de Salón</label>
                <div className="relative">
                  <select 
                    value={formData.salon} 
                    onChange={(e) => setFormData({...formData, salon: e.target.value})}
                    className="w-full appearance-none bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary">
                    {availableVenues.length > 0 ? (
                      <>
                        {availableVenues.map(venue => (
                          <option key={venue.venue_id} value={venue.name}>{venue.name}</option>
                        ))}
                        <option value="Ambos">Ambos</option>
                      </>
                    ) : (
                      <>
                        <option value="Salón">Salón</option>
                        <option value="Terraza">Terraza</option>
                        <option value="Ambos">Ambos</option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Horario Reserva</label>
                <div className="relative">
                  <select 
                    value={formData.horario} 
                    onChange={(e) => setFormData({...formData, horario: e.target.value})}
                    className="w-full appearance-none bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary">
                    <option value="20:00-03:00">Noche (20:00 - 03:00)</option>
                    <option value="14:00-21:00">Tarde (14:00 - 21:00)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Fecha</label>
                <div className="relative">
                  <input 
                    type="date" 
                    required
                    value={formData.fecha} 
                    onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                    className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer cursor-pointer" />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none" size={18} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Tipo de evento</label>
                <div className="relative">
                  <select 
                    value={formData.tipo} 
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                    className="w-full appearance-none bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary">
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

            <div className="flex flex-col gap-2">
              <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Descripción del evento</label>
              <input 
                type="text" 
                value={formData.descripcion} 
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Número de Invitados</label>
              <input 
                type="number" 
                min="1"
                value={formData.invitados}
                onChange={(e) => setFormData({...formData, invitados: e.target.value})}
                placeholder="Ej: 50"
                className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary placeholder:text-outline-variant" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-jakarta font-semibold text-white mb-4">Servicios Requeridos</h4>
                <div className="flex flex-col gap-3">
                  {availableServices.length > 0 ? (
                    availableServices.slice(0, Math.ceil(availableServices.length / 2)).map(service => {
                      const name = service.service_type;
                      return (
                        <label key={name} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={formData.servicios[name] || false}
                            onChange={() => handleServiceChange(name)}
                            className="sr-only" />
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${formData.servicios[name] ? 'border-primary' : 'border-outline'}`}>
                            <div className={`w-2 h-2 rounded-full transition-colors ${formData.servicios[name] ? 'bg-primary' : 'bg-transparent'}`}></div>
                          </div>
                          <span className="text-sm font-jakarta text-on-surface-variant flex items-center gap-2">
                            {service.name ? `${service.name} (${service.service_type})` : service.service_type} <span className="text-xs text-primary/70">${parseFloat(service.base_price || 0).toFixed(2)}</span>
                          </span>
                        </label>
                      );
                    })
                  ) : (
                    <span className="text-sm text-outline">Cargando servicios...</span>
                  )}
                </div>
              </div>

              <div>
                <div className="h-4 mb-4"></div>
                <div className="flex flex-col gap-3">
                  {availableServices.length > 0 && availableServices.slice(Math.ceil(availableServices.length / 2)).map(service => {
                    const name = service.service_type;
                    return (
                      <label key={name} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={formData.servicios[name] || false}
                          onChange={() => handleServiceChange(name)}
                          className="sr-only" />
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${formData.servicios[name] ? 'border-primary' : 'border-outline'}`}>
                          <div className={`w-2 h-2 rounded-full transition-colors ${formData.servicios[name] ? 'bg-primary' : 'bg-transparent'}`}></div>
                        </div>
                        <span className="text-sm font-jakarta text-on-surface-variant flex items-center gap-2">
                            {service.name ? `${service.name} (${service.service_type})` : service.service_type} <span className="text-xs text-primary/70">${parseFloat(service.base_price || 0).toFixed(2)}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <div>
                <h4 className="text-sm font-jakarta font-semibold text-white mb-4">Personal Requerido</h4>
                <div className="flex flex-col gap-3">
                  {['Mesoneros', 'Barman'].map(role => (
                    <label key={role} className="flex items-center gap-3 cursor-pointer group">
                      <span className="text-sm font-jakarta text-on-surface-variant flex-1">{role}</span>
                      <input 
                        type="number" 
                        min="0" 
                        value={formData.personal[role] || ''}
                        onChange={(e) => handlePersonalChange(role, e.target.value)}
                        placeholder="0" 
                        className="w-16 bg-surface-container-highest/50 border border-outline-variant rounded-md px-2 py-1 text-on-surface text-center focus:outline-none focus:border-primary text-sm" 
                        onClick={e => e.stopPropagation()} />
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div className="h-4 mb-4"></div>
                <div className="flex flex-col gap-3">
                  {['Seguridad'].map(role => (
                    <label key={role} className="flex items-center gap-3 cursor-pointer group">
                      <span className="text-sm font-jakarta text-on-surface-variant flex-1">{role}</span>
                      <input 
                        type="number" 
                        min="0" 
                        value={formData.personal[role] || ''}
                        onChange={(e) => handlePersonalChange(role, e.target.value)}
                        placeholder="0" 
                        className="w-16 bg-surface-container-highest/50 border border-outline-variant rounded-md px-2 py-1 text-on-surface text-center focus:outline-none focus:border-primary text-sm" 
                        onClick={e => e.stopPropagation()} />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="flex flex-col gap-6">
            <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors self-start mb-2" disabled={isSubmitting}>
              <ArrowLeft size={18} /> Volver a los detalles
            </button>
            
            <div className="bg-surface-container-highest/30 p-6 rounded-lg border border-primary/20 mb-4">
              <h4 className="text-lg font-playfair font-bold text-white mb-2">Resumen de tu Cotización</h4>
              <p className="text-sm font-jakarta text-on-surface-variant mb-1">Has seleccionado el <strong>{formData.salon}</strong> para el <strong>{formData.fecha || 'fecha por definir'}</strong>.</p>
              <p className="text-sm font-jakarta text-on-surface-variant mb-4">El costo estimado incluye todos los servicios y personal solicitados.</p>
              <div className="text-3xl font-bold text-primary">$<AnimatedNumber value={precioEstimado} /> USD</div>
            </div>

            <h4 className="text-lg font-playfair font-bold text-white mb-2">Tus Datos de Contacto</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Nombre Completo *</label>
                <input type="text" required minLength={3} maxLength={60} disabled={isSubmitting} value={formData.contacto.nombre} onChange={e => setFormData({...formData, contacto: {...formData.contacto, nombre: e.target.value}})} placeholder="Ej: Juan Pérez" className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary placeholder:text-outline-variant disabled:opacity-50" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Teléfono (WhatsApp) *</label>
                <input type="tel" required pattern="[\+0-9\-\s]{8,20}" title="Ingrese un número válido (solo números, +, guiones o espacios). Ej: +58 414 1234567" disabled={isSubmitting} value={formData.contacto.telefono} onChange={e => setFormData({...formData, contacto: {...formData.contacto, telefono: e.target.value}})} placeholder="Ej: +58 414 1234567" className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary placeholder:text-outline-variant disabled:opacity-50" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Correo Electrónico *</label>
                <input type="email" required disabled={isSubmitting} value={formData.contacto.correo} onChange={e => setFormData({...formData, contacto: {...formData.contacto, correo: e.target.value}})} placeholder="ejemplo@correo.com" className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary placeholder:text-outline-variant disabled:opacity-50" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-6 pt-6 border-t border-white/10">
        {step === 1 && (
          <div className="flex flex-col">
            <span className="text-sm font-jakarta text-on-surface-variant uppercase tracking-wider">Cotización Estimada</span>
            <span className="text-2xl font-bold text-white">$<AnimatedNumber value={precioEstimado} /> USD</span>
          </div>
        )}
        
        {step === 2 && (
          <div className="flex flex-col">
            <span className="text-sm font-jakarta text-on-surface-variant uppercase tracking-wider">Total a Reservar</span>
            <span className="text-2xl font-bold text-white">$<AnimatedNumber value={precioEstimado} /> USD</span>
          </div>
        )}

        <Button variant="primary" type="submit" className="w-full sm:w-auto h-[46px]" disabled={isSubmitting}>
          {isSubmitting ? 'Procesando solicitud...' : (step === 1 ? 'Continuar a Reserva' : 'Confirmar Reserva')}
        </Button>
      </div>
    </motion.form>
  );
}
