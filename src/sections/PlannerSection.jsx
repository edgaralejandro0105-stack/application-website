import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ChevronDown, Calendar, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export function PlannerSection() {
  const [step, setStep] = useState(1); // 1: Cotizador, 2: Contacto, 3: Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    salon: 'Salón',
    horario: 'Noche (20:00 - 03:00)',
    fecha: '',
    tipo: 'Bodas',
    descripcion: '',
    servicios: {
      'Show de garotas': false,
      'Robots LED': false,
      'Show de Luces y Pantallas': false,
      'DJ': false,
      'Show de disfrases': false
    },
    personal: {
      'Mesoneros': 0,
      'Barman': 0,
      'Seguridad': 0
    },
    contacto: {
      nombre: '',
      telefono: '',
      correo: ''
    }
  });

  const [precioEstimado, setPrecioEstimado] = useState(0);

  // Lógica de Precios del Prototipo (Se pueden editar fácilmente luego)
  useEffect(() => {
    let total = 0;
    if (formData.salon === 'Salón') total += 150;
    if (formData.salon === 'Terraza') total += 100;
    if (formData.salon === 'Ambos') total += 350;

    if (formData.servicios['Show de garotas']) total += 200;
    if (formData.servicios['Robots LED']) total += 150;
    if (formData.servicios['Show de Luces y Pantallas']) total += 100;
    if (formData.servicios['DJ']) total += 30;
    if (formData.servicios['Show de disfraces']) total += 80;

    total += (parseInt(formData.personal['Mesoneros']) || 0) * 20;
    total += (parseInt(formData.personal['Barman']) || 0) * 30;
    total += (parseInt(formData.personal['Seguridad']) || 0) * 40;

    setPrecioEstimado(total);
  }, [formData]);

  const handleServiceChange = (service) => {
    setFormData(prev => ({
      ...prev,
      servicios: {
        ...prev.servicios,
        [service]: !prev.servicios[service]
      }
    }));
  };

  const handlePersonalChange = (role, value) => {
    setFormData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [role]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(3);
      }, 1500);
    }
  };

  return (
    <section id="planificador" className="py-24 bg-background relative z-10">
      <div className="max-w-[1200px] mx-auto px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-2 uppercase tracking-wide">Reserva tu Evento</h2>
          <p className="font-jakarta text-on-surface-variant text-sm">Cotiza en tiempo real y reserva tu fecha.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="max-w-4xl mx-auto p-8 border-white/10 bg-surface-container-low/40">
            {step === 3 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6"
                >
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </motion.div>
                <h3 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-4">¡Solicitud Registrada!</h3>
                <p className="font-jakarta text-on-surface-variant max-w-md mx-auto mb-8 leading-relaxed">
                  Tu solicitud ha sido enviada correctamente. Un miembro de nuestro equipo se pondrá en contacto contigo a la brevedad para confirmar los detalles.
                </p>
                <Button variant="outline" onClick={() => { setStep(1); setPrecioEstimado(0); }}>Nueva Solicitud</Button>
              </div>
            ) : (
              <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-8">
                    {/* Top Row: Selects & Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Tipo de Salón</label>
                        <div className="relative">
                          <select 
                            value={formData.salon} 
                            onChange={(e) => setFormData({...formData, salon: e.target.value})}
                            className="w-full appearance-none bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary">
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
                          <select 
                            value={formData.horario} 
                            onChange={(e) => setFormData({...formData, horario: e.target.value})}
                            className="w-full appearance-none bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary">
                            <option>Noche (20:00 - 03:00)</option>
                            <option>Tarde (14:00 - 21:00)</option>
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

                    {/* Middle: Text Input */}
                    <div className="flex flex-col gap-2">
                      <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Descripción del evento</label>
                      <input 
                        type="text" 
                        value={formData.descripcion} 
                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                        className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary" />
                    </div>

                    {/* Checkboxes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-sm font-jakarta font-semibold text-white mb-4">Servicios Requeridos</h4>
                        <div className="flex flex-col gap-3">
                          {['Show de garotas', 'Robots LED', 'Show de Luces y Pantallas'].map(item => (
                            <label key={item} className="flex items-center gap-3 cursor-pointer group">
                              <input 
                                type="checkbox" 
                                checked={formData.servicios[item]}
                                onChange={() => handleServiceChange(item)}
                                className="sr-only" />
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${formData.servicios[item] ? 'border-primary' : 'border-outline'}`}>
                                <div className={`w-2 h-2 rounded-full transition-colors ${formData.servicios[item] ? 'bg-primary' : 'bg-transparent'}`}></div>
                              </div>
                              <span className="text-sm font-jakarta text-on-surface-variant">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="h-4 mb-4"></div> {/* Spacer for alignment */}
                        <div className="flex flex-col gap-3">
                          {['DJ', 'Show de disfrases'].map(item => (
                            <label key={item} className="flex items-center gap-3 cursor-pointer group">
                              <input 
                                type="checkbox" 
                                checked={formData.servicios[item]}
                                onChange={() => handleServiceChange(item)}
                                className="sr-only" />
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${formData.servicios[item] ? 'border-primary' : 'border-outline'}`}>
                                <div className={`w-2 h-2 rounded-full transition-colors ${formData.servicios[item] ? 'bg-primary' : 'bg-transparent'}`}></div>
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
                        <div className="h-4 mb-4"></div> {/* Spacer */}
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
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
                    <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors self-start mb-2">
                      <ArrowLeft size={18} /> Volver a los detalles
                    </button>
                    
                    <div className="bg-surface-container-highest/30 p-6 rounded-lg border border-primary/20 mb-4">
                      <h4 className="text-lg font-playfair font-bold text-white mb-2">Resumen de tu Cotización</h4>
                      <p className="text-sm font-jakarta text-on-surface-variant mb-1">Has seleccionado el <strong>{formData.salon}</strong> para el <strong>{formData.fecha || 'fecha por definir'}</strong>.</p>
                      <p className="text-sm font-jakarta text-on-surface-variant mb-4">El costo estimado incluye todos los servicios y personal solicitados.</p>
                      <div className="text-3xl font-bold text-primary">${precioEstimado} USD</div>
                    </div>

                    <h4 className="text-lg font-playfair font-bold text-white mb-2">Tus Datos de Contacto</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Nombre Completo *</label>
                        <input type="text" required placeholder="Ej: Juan Pérez" className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary placeholder:text-outline-variant" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Teléfono (WhatsApp) *</label>
                        <input type="tel" required placeholder="Ej: +58 414 1234567" className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary placeholder:text-outline-variant" />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Correo Electrónico *</label>
                        <input type="email" required placeholder="ejemplo@correo.com" className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary placeholder:text-outline-variant" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Footer del Formulario */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-6 pt-6 border-t border-white/10">
                  {step === 1 && (
                    <div className="flex flex-col">
                      <span className="text-sm font-jakarta text-on-surface-variant uppercase tracking-wider">Cotización Estimada</span>
                      <span className="text-2xl font-bold text-white">${precioEstimado} USD</span>
                    </div>
                  )}
                  
                  {step === 2 && (
                    <div className="flex flex-col">
                      <span className="text-sm font-jakarta text-on-surface-variant uppercase tracking-wider">Total a Reservar</span>
                      <span className="text-2xl font-bold text-white">${precioEstimado} USD</span>
                    </div>
                  )}

                  <Button variant="primary" type="submit" className="px-8 w-full sm:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Procesando...
                      </span>
                    ) : step === 1 ? (
                      'Continuar a Reserva'
                    ) : (
                      'Confirmar Reserva'
                    )}
                  </Button>
                </div>

              </form>
            )}
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
