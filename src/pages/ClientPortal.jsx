import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CalendarDays, FileText, CheckCircle2, ChevronRight, Download, Loader2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useClientAuth } from '../context/ClientAuthContext';

export function ClientPortal() {
  const navigate = useNavigate();
  const { client, token, logout, isAuthenticated } = useClientAuth();
  
  const [events, setEvents] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://api-lacasona.onrender.com/api';
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch Events
        const evRes = await fetch(`${apiUrl}/client-portal/my-events`, { headers });
        const evData = await evRes.json();
        setEvents(evData);

        // If there's at least one event, fetch its milestones
        if (evData && evData.length > 0) {
          const activeEvent = evData[0];
          const msRes = await fetch(`${apiUrl}/client-portal/my-events/${activeEvent.event_id}/milestones`, { headers });
          if (msRes.ok) {
            const msData = await msRes.json();
            setMilestones(msData);
          }
        }

        // Fetch Invoices
        const invRes = await fetch(`${apiUrl}/client-portal/my-invoices`, { headers });
        if (invRes.ok) {
          const invData = await invRes.json();
          setInvoices(invData);
        }
      } catch (err) {
        console.error('Error fetching portal data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate, token]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!client || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary w-12 h-12 mb-4" />
        <p className="text-on-surface-variant font-jakarta">Cargando tu portal...</p>
      </div>
    );
  }

  const activeEvent = events.length > 0 ? events[0] : null;

  return (
    <div className="min-h-screen bg-background relative overflow-x-clip text-on-background selection:bg-primary/30 selection:text-primary pt-24 pb-12">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-16 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-2">Bienvenido, {client.name} {client.last_name}</h1>
            <p className="font-jakarta text-on-surface-variant">Portal Privado del Cliente</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-on-surface-variant hover:text-white hover:bg-surface-container transition-all text-sm font-jakarta"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Próximo Evento */}
            <section>
              <h2 className="font-playfair text-xl text-white mb-4 flex items-center gap-2">
                <CalendarDays className="text-primary" /> Mi Próximo Evento
              </h2>
              {activeEvent ? (
                <Card className="p-6 md:p-8 bg-surface-container-low/40 border-primary/20 hover:border-primary/50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div>
                      <div className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold font-jakarta mb-4 ${
                        activeEvent.status === 'Confirmed' ? 'border-secondary/30 bg-secondary/10 text-secondary' : 
                        activeEvent.status === 'Pending' ? 'border-amber-500/30 bg-amber-500/10 text-amber-500' :
                        'border-white/20 bg-white/5 text-white'
                      }`}>
                        {activeEvent.status === 'Confirmed' ? 'Confirmado' : activeEvent.status === 'Pending' ? 'Pendiente' : activeEvent.status}
                      </div>
                      <h3 className="font-playfair text-2xl font-bold text-white mb-1">Tu {activeEvent.type_event}</h3>
                      <p className="font-jakarta text-on-surface-variant text-sm mb-4">
                        {activeEvent.start_date ? new Date(activeEvent.start_date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Fecha por definir'}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm font-jakarta text-on-surface-variant">
                        <div><strong className="text-white">Área:</strong> {activeEvent.Venues && activeEvent.Venues.length > 0 ? activeEvent.Venues.map(v => v.name).join(', ') : 'N/A'}</div>
                        <div><strong className="text-white">Invitados:</strong> {activeEvent.guests || 0}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 justify-end">
                      <Button variant="primary" className="w-full justify-center">Ver Detalles</Button>
                      <button className="text-sm font-jakarta text-primary hover:underline w-full text-center">Contactar Planner</button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-8 text-center bg-surface-container-low/40">
                  <p className="text-on-surface-variant font-jakarta">No tienes eventos próximos registrados.</p>
                </Card>
              )}
            </section>

            {/* Progreso del Evento */}
            {activeEvent && (
              <section>
                <h2 className="font-playfair text-xl text-white mb-4">Progreso de Preparativos</h2>
                <Card className="p-6 bg-surface-container-low/40 border-white/5">
                  {milestones.length > 0 ? (
                    <div className="space-y-6">
                      {milestones.map((ms, idx) => {
                        const isCompleted = ms.status === 'Completed';
                        const isPendingAction = ms.status === 'Pending' && idx === milestones.findIndex(m => m.status === 'Pending'); // The current active task
                        
                        return (
                          <div key={ms.milestone_id} className={`flex items-start gap-4 relative ${!isCompleted && !isPendingAction ? 'opacity-50' : ''}`}>
                            {idx < milestones.length - 1 && (
                              <div className="absolute left-3 top-6 bottom-[-24px] w-px bg-white/10"></div>
                            )}
                            
                            {isCompleted ? (
                              <CheckCircle2 className="text-secondary shrink-0 mt-0.5" />
                            ) : isPendingAction ? (
                              <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center shrink-0 z-10 bg-background relative -left-0.5">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-white/20 shrink-0 relative -left-0.5"></div>
                            )}

                            <div>
                              <h4 className={`${isCompleted ? 'text-white' : isPendingAction ? 'text-primary' : 'text-white'} font-semibold text-sm`}>
                                {ms.title}
                              </h4>
                              <p className="text-xs text-on-surface-variant mt-1">
                                {ms.description || (isCompleted ? 'Completado' : 'Pendiente')}
                              </p>
                              {isPendingAction && (
                                <button className="text-xs text-primary mt-2 flex items-center gap-1 hover:underline">
                                  Ver detalles <ChevronRight size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-on-surface-variant">Las tareas de preparativos se generarán una vez que el evento sea confirmado.</p>
                  )}
                </Card>
              </section>
            )}
            
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            
            {/* Facturas */}
            <section>
              <h2 className="font-playfair text-xl text-white mb-4 flex items-center gap-2">
                <FileText className="text-primary" /> Mis Recibos
              </h2>
              <Card className="p-0 bg-surface-container-low/40 border-white/5 overflow-hidden">
                <div className="divide-y divide-white/5">
                  {invoices.length > 0 ? (
                    invoices.map(inv => (
                      <div key={inv.sale_id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                        <div>
                          <h4 className="text-sm font-semibold text-white">Pago de Evento</h4>
                          <p className="text-xs text-on-surface-variant">Ref: #{inv.reference} • ${inv.total}</p>
                        </div>
                        <button className="text-on-surface-variant group-hover:text-primary transition-colors" title="Descargar PDF">
                          <Download size={18} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-sm text-on-surface-variant">
                      No hay recibos registrados aún.
                    </div>
                  )}
                </div>
              </Card>
            </section>

            {/* Asistencia Rápida */}
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-surface-container border border-primary/20">
              <h3 className="font-playfair text-lg text-white mb-2">¿Necesitas ayuda?</h3>
              <p className="text-sm font-jakarta text-on-surface-variant mb-4">
                Si tienes dudas sobre tu reserva, contáctanos directamente.
              </p>
              <Button variant="outline" className="w-full bg-surface/50 justify-center">Contactar por WhatsApp</Button>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
