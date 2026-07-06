import { useState, useEffect } from 'react';
import { getServices, getVenues, getEmployees } from '../services/api';
import emailjs from '@emailjs/browser';

export function usePlannerLogic() {
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
  const [precioEstimado, setPrecioEstimado] = useState(0);

  const [isDataLoading, setIsDataLoading] = useState(true);
  const [initialDataError, setInitialDataError] = useState(false);

  const [formData, setFormData] = useState({
    salon: '',
    horario: '20:00-03:00',
    fecha: '',
    tipo: 'Bodas',
    invitados: '',
    descripcion: '',
    servicios: {},
    personal: {
      'Mesoneros': 0,
      'Barman': 0,
      'Seguridad': 0
    },
    contacto: {
      nombre: '',
      cedula: '',
      telefono: '',
      correo: ''
    }
  });

  // Listeners para abrir pestañas desde otras partes de la app
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

  const fetchPlannerData = async () => {
    setIsDataLoading(true);
    setInitialDataError(false);
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
      
      const initialServicios = {};
      servicesData.forEach(s => initialServicios[s.service_type] = false);
      
      setFormData(prev => ({
        ...prev,
        servicios: initialServicios,
        salon: prev.salon || (venuesData.length > 0 ? venuesData[0].name : 'Salón')
      }));
    } catch (err) {
      console.error('Error fatal cargando datos del cotizador:', err);
      setInitialDataError(true);
    } finally {
      setIsDataLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchPlannerData();
  }, []);

  const retryFetchData = () => {
    fetchPlannerData();
  };

  // Lógica de Precios Dinámica
  useEffect(() => {
    let total = 0;
    
    if (formData.salon === 'Ambos') {
      availableVenues.forEach(v => total += parseFloat(v.base_price || 0));
    } else {
      const v = availableVenues.find(v => v.name === formData.salon);
      if (v) total += parseFloat(v.base_price || 0); 
    }

    availableServices.forEach(service => {
      const name = service.service_type;
      if (formData.servicios[name]) {
        total += parseFloat(service.base_price || 0);
      }
    });

    const roles = Object.keys(formData.personal);
    roles.forEach(role => {
      const count = parseInt(formData.personal[role]) || 0;
      if (count > 0) {
        const employeesWithRole = availableEmployees.filter(e => e.rol === role);
        if (employeesWithRole.length > 0) {
           const salary = parseFloat(employeesWithRole[0].salary_per_event || 0);
           total += count * salary;
        } else {
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

  const handleConsulta = async (e) => {
    e.preventDefault();
    if (!consultaCorreo.trim()) return;
    setLoadingConsulta(true);
    setErrorConsulta(null);
    setSearchedConsulta(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://api-lacasona.onrender.com/api';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setIsSubmitting(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://api-lacasona.onrender.com/api';
        const response = await fetch(`${apiUrl}/events/website`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        // SOLO si la API responde 200/201 enviamos los correos
        if (response.ok || response.status === 201) {
          const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
          const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

          if (serviceId && publicKey && serviceId !== 'your_service_id') {
            const serviciosSeleccionados = Object.keys(formData.servicios)
              .filter(key => formData.servicios[key])
              .join(', ') || 'Ninguno';

            const personalRequerido = Object.keys(formData.personal)
              .filter(key => formData.personal[key] > 0)
              .map(key => `${key}: ${formData.personal[key]}`)
              .join(', ') || 'Ninguno';

            const fechaFormateada = formData.fecha ? formData.fecha.split('-').reverse().join('/') : 'N/A';

            const messageBody = `Detalles de la Pre-reserva:
👤 Cliente: ${formData.contacto.nombre}
📞 Teléfono: ${formData.contacto.telefono}
📧 Correo: ${formData.contacto.correo}
📅 Fecha: ${fechaFormateada}
🏢 Salón: ${formData.salon}
⏱️ Horario: ${formData.horario}
🎉 Tipo de Evento: ${formData.tipo}
👥 Invitados: ${formData.invitados || 'No especificado'}
📝 Descripción: ${formData.descripcion || 'Sin descripción'}

Servicios Seleccionados: ${serviciosSeleccionados}
Personal Requerido: ${personalRequerido}
Costo Estimado: $${precioEstimado} USD`;

            const commonParams = {
              from_name: formData.contacto.nombre,
              nombre_cliente: formData.contacto.nombre,
              correo_cliente: formData.contacto.correo,
              telefono_cliente: formData.contacto.telefono,
              salon: formData.salon,
              horario: formData.horario,
              fecha: fechaFormateada,
              tipo_evento: formData.tipo,
              invitados: formData.invitados || 'No especificado',
              descripcion: formData.descripcion || 'Sin descripción',
              servicios: serviciosSeleccionados,
              personal: personalRequerido,
              precio_estimado: precioEstimado
            };

            const adminTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            if (adminTemplateId) {
              emailjs.send(serviceId, adminTemplateId, {
                ...commonParams,
                to_name: 'Administración La Casona',
                message: messageBody,
                reply_to: formData.contacto.correo,
              }, publicKey).catch(err => console.error('Error correo admin:', err));
            }

            const clientTemplateId = import.meta.env.VITE_EMAILJS_CLIENT_TEMPLATE_ID;
            if (clientTemplateId && formData.contacto.correo) {
              emailjs.send(serviceId, clientTemplateId, {
                ...commonParams,
                to_name: formData.contacto.nombre,
                to_email: formData.contacto.correo,
                reply_to: 'lacasonadisco03@gmail.com',
              }, publicKey).catch(err => console.error('Error correo cliente:', err));
            }
          }

          setStep(3);
        } else {
          console.error('Error al crear la pre-reserva en el servidor');
          // Podríamos setear un error global aquí
        }
      } catch (error) {
        console.error('Error de red al crear la pre-reserva', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setStep(1);
    setPrecioEstimado(0);
  };

  return {
    step,
    setStep,
    isSubmitting,
    activeTab,
    setActiveTab,
    consultaCorreo,
    setConsultaCorreo,
    consultaResult,
    setConsultaResult,
    loadingConsulta,
    errorConsulta,
    setErrorConsulta,
    searchedConsulta,
    setSearchedConsulta,
    availableServices,
    availableVenues,
    availableEmployees,
    precioEstimado,
    formData,
    setFormData,
    handleServiceChange,
    handlePersonalChange,
    handleConsulta,
    handleSubmit,
    resetForm,
    isDataLoading,
    initialDataError,
    retryFetchData
  };
}
