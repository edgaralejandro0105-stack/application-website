import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ChevronDown, Calendar, ArrowLeft, Search, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getServices, getVenues, getEmployees } from '../services/api';
export function PlannerSection() {
  const [step, setStep] = useState(1); // 1: Cotizador, 2: Contacto, 3: Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('reserva'); // 'reserva' o 'consulta'
  const [consultaCorreo, setConsultaCorreo] = useState('');
  const [consultaResult, setConsultaResult] = useState(null);
  const [loadingConsulta, setLoadingConsulta] = useState(false);
  const [errorConsulta, setErrorConsulta] = useState(null);
  const [searchedConsulta, setSearchedConsulta] = useState(false);

  const [availableServices, setAvailableServices] = useState([]);
  const [availableVenues, setAvailableVenues] = useState([]);
  const [availableEmployees, setAvailableEmployees] = useState([]);

  useEffect(() => {
    const handleOpenConsulta = () => {
      const el = document.getElementById('planificador');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      setActiveTab('consulta');
      setConsultaResult(null);
      setSearchedConsulta(false);
      setErrorConsulta(null);
    };

    const handleOpenReserva = () => {
      setActiveTab('reserva');
      setConsultaResult(null);
      setSearchedConsulta(false);
      setErrorConsulta(null);
    };

    window.addEventListener('open-consulta', handleOpenConsulta);
    window.addEventListener('open-reserva', handleOpenReserva);
    
    return () => {
      window.removeEventListener('open-consulta', handleOpenConsulta);
      window.removeEventListener('open-reserva', handleOpenReserva);
    };
  }, []);

  const handleConsulta = async (e) => {
    e.preventDefault();
    if (!consultaCorreo.trim()) return;
    setLoadingConsulta(true);
    setErrorConsulta(null);
    setSearchedConsulta(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/events/website/status?email=${encodeURIComponent(consultaCorreo.trim())}`);
      if (response.ok) {
        const data = await response.json();
        setConsultaResult(data);
      } else {
        const errData = await response.json().catch(() => ({}));
        setErrorConsulta(errData.message || 'Error al consultar la pre-reserva');
      }
    } catch (error) {
      console.error('Error de red al consultar la pre-reserva', error);
      setErrorConsulta('Error de conexión con el servidor. Por favor, intente de nuevo.');
    } finally {
      setLoadingConsulta(false);
    }
  };
  
  const [formData, setFormData] = useState({
    salon: '',
    horario: '20:00-03:00',
    fecha: '',
    tipo: 'Bodas',
    descripcion: '',
    servicios: {},
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

  useEffect(() => {
    const fetchPlannerData = async () => {
      try {
        const [servicesRes, venuesRes, employeesRes] = await Promise.all([
          getServices(),
          getVenues(),
          getEmployees()
        ]);
        const servicesData = (servicesRes.data || servicesRes).filter(s => s.is_active);
        setAvailableServices(servicesData);
        
        const venuesData = (venuesRes.data || venuesRes).filter(v => v.is_active);
        setAvailableVenues(venuesData);

        const employeesData = employeesRes.data || employeesRes;
        setAvailableEmployees(employeesData);
        
        // Configurar valores iniciales dinámicos
        const initialServicios = {};
        servicesData.forEach(s => initialServicios[s.service_type] = false);
        
        setFormData(prev => ({
          ...prev,
          servicios: initialServicios,
          salon: prev.salon || (venuesData.length > 0 ? venuesData[0].name : 'Salón')
        }));
      } catch (err) {
        console.error('Error cargando datos del cotizador:', err);
      }
    };
    fetchPlannerData();
  }, []);

  const [precioEstimado, setPrecioEstimado] = useState(0);

  // Lógica de Precios Dinámica
  useEffect(() => {
    let total = 0;
    
    // Calcular Salón Dinámicamente
    if (formData.salon === 'Ambos') {
      // Sumar todos los salones activos si elige 'Ambos'
      availableVenues.forEach(v => total += parseFloat(v.base_price || 0));
    } else {
      const v = availableVenues.find(v => v.name === formData.salon);
      if (v) total += parseFloat(v.base_price || 0); 
    }

    // Calcular Servicios Dinámicamente
    availableServices.forEach(service => {
      const name = service.service_type;
      if (formData.servicios[name]) {
        total += parseFloat(service.base_price || 0);
      }
    });

    // Calcular Personal Dinámicamente
    const roles = Object.keys(formData.personal);
    roles.forEach(role => {
      const count = parseInt(formData.personal[role]) || 0;
      if (count > 0) {
        // Encontrar un empleado con este rol para sacar el salario promedio o base
        const employeesWithRole = availableEmployees.filter(e => e.rol === role);
        if (employeesWithRole.length > 0) {
           const salary = parseFloat(employeesWithRole[0].salary_per_event || 0);
           total += count * salary;
        } else {
           // Fallback en caso de que no haya empleados con ese rol en BD
           if (role === 'Mesoneros') total += count * 20;
           if (role === 'Barman') total += count * 30;
           if (role === 'Seguridad') total += count * 40;
        }
      }
    });

    setPrecioEstimado(total);
  }, [formData, availableServices, availableVenues, availableEmployees]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setIsSubmitting(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const response = await fetch(`${apiUrl}/events/website`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          setStep(3);
        } else {
          console.error('Error al crear la pre-reserva');
          // Aquí podríamos mostrar un mensaje de error si fuera necesario
        }
      } catch (error) {
        console.error('Error de red al crear la pre-reserva', error);
      } finally {
        setIsSubmitting(false);
      }
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
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-2 uppercase tracking-wide">
            {activeTab === 'reserva' ? 'Reserva tu Evento' : 'Consulta tu Reserva'}
          </h2>
          <p className="font-jakarta text-on-surface-variant text-sm">
            {activeTab === 'reserva' ? 'Cotiza en tiempo real y reserva tu fecha.' : 'Revisa los detalles y el estado actual de tu solicitud.'}
            {step !== 3 && activeTab === 'consulta' && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('reserva');
                  setConsultaResult(null);
                  setSearchedConsulta(false);
                  setErrorConsulta(null);
                }}
                className="text-primary hover:text-primary-fixed-dim hover:underline ml-2 font-semibold transition-colors cursor-pointer"
              >
                Volver al Planificador
              </button>
            )}
          </p>
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
                  className="w-20 h-20 bg-[#25D366]/20 rounded-full flex items-center justify-center mb-6"
                >
                  <svg className="w-10 h-10 text-[#25D366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </motion.div>
                <h3 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-4">¡Casi listo!</h3>
                <div className="font-jakarta text-on-surface-variant max-w-md mx-auto mb-8 leading-relaxed space-y-2">
                  <p>Tu pre-reserva ha sido guardada en nuestra base de datos, pero <strong className="text-amber-400 font-bold">expirará en 24 horas</strong>.</p>
                  <p>Por favor, envíanos un WhatsApp ahora mismo para asegurar tu fecha de forma definitiva.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Button 
                    variant="primary" 
                    className="bg-[#25D366] hover:bg-[#20b858] text-white border-none flex items-center gap-2 animate-pulse shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_25px_rgba(37,211,102,0.6)] transition-all duration-300 transform hover:scale-105"
                    onClick={() => {
                      const phoneNumber = '584127887461';
                      const message = `¡Hola! Acabo de hacer una reserva web para La Casona.\n\n*Detalles de mi Reserva:*\n👤 Nombre: ${formData.contacto.nombre}\n🏢 Salón: ${formData.salon}\n📅 Fecha: ${formData.fecha || 'Por definir'}\n⏱️ Horario: ${formData.horario}\n💵 Total Estimado: $${precioEstimado} USD\n\nQuedo atento para confirmar.`;
                      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                    Asegurar mi fecha por WhatsApp
                  </Button>
                  <Button variant="outline" onClick={() => { setStep(1); setPrecioEstimado(0); }}>Cerrar</Button>
                </div>
              </div>
            ) : activeTab === 'consulta' ? (
              <div className="flex flex-col gap-8 animate-in fade-in duration-500">
                <div className="text-center max-w-lg mx-auto">
                  <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">Consulta el estado de tu pre-reserva</h3>
                  <p className="font-jakarta text-on-surface-variant text-sm">
                    Ingresa el correo electrónico que utilizaste al registrar tu solicitud.
                  </p>
                </div>

                <form onSubmit={handleConsulta} className="max-w-md mx-auto w-full flex flex-col sm:flex-row gap-4 items-end justify-center">
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em] text-xs">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@correo.com"
                      value={consultaCorreo}
                      onChange={(e) => setConsultaCorreo(e.target.value)}
                      className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary placeholder:text-outline-variant"
                    />
                  </div>
                  <Button variant="primary" type="submit" className="w-full sm:w-auto h-[46px] shrink-0" disabled={loadingConsulta}>
                    {loadingConsulta ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Buscando
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Search size={14} />
                        Buscar
                      </span>
                    )}
                  </Button>
                </form>

                {errorConsulta && (
                  <div className="max-w-md mx-auto w-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-md p-4 text-center">
                    {errorConsulta}
                  </div>
                )}

                {searchedConsulta && !loadingConsulta && !errorConsulta && (
                  <div className="mt-4">
                    {!consultaResult || !consultaResult.client || consultaResult.events.length === 0 ? (
                      <div className="text-center py-8 animate-in fade-in duration-300">
                        <p className="font-jakarta text-on-surface-variant text-sm">
                          No encontramos pre-reservas asociadas a ese correo electrónico.
                        </p>
                        <p className="font-jakarta text-xs text-outline-variant mt-2">
                          Por favor, verifica que el correo coincida exactamente con el que ingresaste al reservar.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-6">
                        <div className="border-b border-white/10 pb-4">
                          <h4 className="font-playfair text-lg font-bold text-white flex items-center gap-2">
                            <CheckCircle className="text-primary" size={20} />
                            Hola, {consultaResult.client.name} {consultaResult.client.last_name}
                          </h4>
                          <p className="font-jakarta text-on-surface-variant text-sm mt-1">
                            Encontramos {consultaResult.events.length} {consultaResult.events.length === 1 ? 'pre-reserva' : 'pre-reservas'} en nuestro sistema:
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {consultaResult.events.map((event) => {
                            // Formatear fecha
                            const cleanDateStr = event.start_date.split('T')[0];
                            const [y, m, d] = cleanDateStr.split('-').map(Number);
                            const localDateObj = new Date(y, m - 1, d);
                            
                            const formattedDate = localDateObj.toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            });

                            // Formatear horario
                            const startDateObj = new Date(event.start_date);
                            const endDateObj = new Date(event.end_date);
                            
                            const startHour = startDateObj.getHours().toString().padStart(2, '0');
                            const startMin = startDateObj.getMinutes().toString().padStart(2, '0');
                            const endHour = endDateObj.getHours().toString().padStart(2, '0');
                            const endMin = endDateObj.getMinutes().toString().padStart(2, '0');
                            const formattedTime = `${startHour}:${startMin} - ${endHour}:${endMin}`;

                            const statusStyles = {
                              Pending: { text: 'Pendiente', classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
                              Confirmed: { text: 'Confirmado', classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
                              'On Hold': { text: 'En Espera', classes: 'bg-sky-500/10 text-sky-400 border border-sky-500/20' },
                              Cancelled: { text: 'Cancelado', classes: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' },
                              Finished: { text: 'Finalizado', classes: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
                              Lead: { text: 'Lead', classes: 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20' }
                            };

                            const currentStatus = statusStyles[event.status] || { text: event.status, classes: 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20' };

                            return (
                              <div key={event.event_id} className="bg-surface-container-highest/20 border border-white/5 rounded-lg p-5 hover:border-primary/30 transition-all duration-300 animate-in fade-in duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div>
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                      <span className="text-sm font-semibold font-jakarta text-white uppercase tracking-wider">
                                        {event.type_event}
                                      </span>
                                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${currentStatus.classes}`}>
                                        {currentStatus.text}
                                      </span>
                                    </div>
                                    <p className="text-sm font-jakarta text-on-surface-variant mb-1">
                                      Salón: <strong className="text-white">{event.venue}</strong>
                                    </p>
                                    <p className="text-sm font-jakarta text-on-surface-variant flex items-center gap-1.5">
                                      <Calendar size={14} className="text-primary" />
                                      <span className="capitalize">{formattedDate}</span>
                                      <span className="text-outline">|</span>
                                      <Clock size={14} className="text-primary ml-1" />
                                      <span>{formattedTime}</span>
                                    </p>
                                  </div>
                                  <div className="text-xs font-jakarta text-outline-variant bg-white/5 px-2 py-1 rounded border border-white/5">
                                    Reserva #{event.event_id}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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

                    {/* Middle: Text Input */}
                    <div className="flex flex-col gap-2">
                      <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Descripción del evento</label>
                      <input 
                        type="text" 
                        value={formData.descripcion} 
                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                        className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary" />
                    </div>

                    {/* Checkboxes Dinámicos */}
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
                                    {name} <span className="text-xs text-primary/70">${parseFloat(service.base_price || 0).toFixed(2)}</span>
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
                        <div className="h-4 mb-4"></div> {/* Spacer for alignment */}
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
                                    {name} <span className="text-xs text-primary/70">${parseFloat(service.base_price || 0).toFixed(2)}</span>
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
                        <input type="text" required value={formData.contacto.nombre} onChange={e => setFormData({...formData, contacto: {...formData.contacto, nombre: e.target.value}})} placeholder="Ej: Juan Pérez" className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary placeholder:text-outline-variant" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Teléfono (WhatsApp) *</label>
                        <input type="tel" required value={formData.contacto.telefono} onChange={e => setFormData({...formData, contacto: {...formData.contacto, telefono: e.target.value}})} placeholder="Ej: +58 414 1234567" className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary placeholder:text-outline-variant" />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Correo Electrónico *</label>
                        <input type="email" required value={formData.contacto.correo} onChange={e => setFormData({...formData, contacto: {...formData.contacto, correo: e.target.value}})} placeholder="ejemplo@correo.com" className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary placeholder:text-outline-variant" />
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
