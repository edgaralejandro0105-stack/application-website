import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CalendarDays, FileText, CheckCircle2, ChevronRight, CreditCard, Loader2, ChevronDown, ChevronUp, Phone, Clock, History, Download, Circle, Check } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useClientAuth } from '../context/ClientAuthContext';
import { PaymentModal } from '../components/PaymentModal';
import { getInvoicePayments, updateMilestone } from '../services/api';

const WHATSAPP_NUMBER = '584127887461';

export function ClientPortal() {
  const navigate = useNavigate();
  const { client, token, logout, isAuthenticated } = useClientAuth();
  
  const [events, setEvents] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [paymentsByInvoice, setPaymentsByInvoice] = useState({});
  const [expandedInvoice, setExpandedInvoice] = useState(null);
  const [updatingMilestone, setUpdatingMilestone] = useState(null);

  const openWhatsApp = (message) => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://api-lacasona.onrender.com/api';
        const headers = { 'Authorization': `Bearer ${token}` };

        const evRes = await fetch(`${apiUrl}/client-portal/my-events`, { headers });
        const evData = await evRes.json();
        setEvents(evData);

        if (evData && evData.length > 0) {
          const activeEvent = evData[0];
          const msRes = await fetch(`${apiUrl}/client-portal/my-events/${activeEvent.event_id}/milestones`, { headers });
          if (msRes.ok) {
            const msData = await msRes.json();
            setMilestones(msData);
          }
        }

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

  const toggleInvoicePayments = async (saleId) => {
    if (expandedInvoice === saleId) {
      setExpandedInvoice(null);
      return;
    }
    setExpandedInvoice(saleId);
    if (!paymentsByInvoice[saleId]) {
      try {
        const data = await getInvoicePayments(saleId, token);
        setPaymentsByInvoice(prev => ({ ...prev, [saleId]: data }));
      } catch (err) {
        console.error('Error fetching payments:', err);
      }
    }
  };

  const handleToggleMilestone = async (ms, eventId) => {
    setUpdatingMilestone(ms.milestone_id);
    try {
      const newStatus = ms.status === 'Completed' ? 'Pending' : 'Completed';
      await updateMilestone(eventId, ms.milestone_id, newStatus, token);
      setMilestones(prev => prev.map(m => m.milestone_id === ms.milestone_id ? { ...m, status: newStatus, completed_at: newStatus === 'Completed' ? new Date() : null } : m));
    } catch (err) {
      console.error('Error updating milestone:', err);
    } finally {
      setUpdatingMilestone(null);
    }
  };

  const downloadReceipt = (payment, invoiceRef) => {
    const isPaid = Number(payment.amount) > 0;
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Recibo #${payment.transaction_id || payment.payment_id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: #f5f5f5;
      display: flex;
      justify-content: center;
      padding: 40px 20px;
    }
    .receipt {
      max-width: 420px;
      width: 100%;
      background: #fff;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
      margin-bottom: 24px;
    }
    .header h1 {
      font-size: 20px;
      font-weight: 700;
      color: #1a1a1a;
      letter-spacing: -0.3px;
    }
    .header p {
      font-size: 12px;
      color: #888;
      margin-top: 4px;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      background: ${isPaid ? '#e8f5e9' : '#fff3e0'};
      color: ${isPaid ? '#2e7d32' : '#e65100'};
      margin-top: 8px;
    }
    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .info-row .label {
      font-size: 13px;
      color: #888;
    }
    .info-row .value {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
    }
    .info-row .value.amount {
      font-size: 22px;
      font-weight: 700;
      color: ${isPaid ? '#2e7d32' : '#1a1a1a'};
    }
    .divider {
      height: 1px;
      background: #f0f0f0;
      margin: 8px 0;
    }
    .footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 2px solid #f0f0f0;
      font-size: 11px;
      color: #aaa;
      line-height: 1.6;
    }
    .footer strong {
      color: #666;
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>La Casona</h1>
      <p>Eventos Francisco C.A.</p>
      <div class="status-badge">${isPaid ? 'Pagado' : 'Pendiente'}</div>
    </div>
    <div class="info-grid">
      <div class="info-row">
        <span class="label">Monto</span>
        <span class="value amount">$${Number(payment.amount).toFixed(2)}</span>
      </div>
      <div class="divider"></div>
      <div class="info-row">
        <span class="label">Transacci\u00f3n</span>
        <span class="value">${payment.transaction_id || `SIM-${payment.payment_id}`}</span>
      </div>
      <div class="info-row">
        <span class="label">Referencia</span>
        <span class="value">#${invoiceRef}</span>
      </div>
      <div class="info-row">
        <span class="label">M\u00e9todo</span>
        <span class="value">${payment.method}</span>
      </div>
      <div class="info-row">
        <span class="label">Fecha</span>
        <span class="value">${new Date(payment.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
    <div class="footer">
      <strong>La Casona</strong><br>
      Recibo generado electr\u00f3nicamente<br>
      V\u00e1lido como comprobante de pago
    </div>
  </div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recibo-${payment.transaction_id || payment.payment_id}.html`;
    a.click();
    URL.revokeObjectURL(url);
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
    <>
      <div className="min-h-screen bg-background relative overflow-x-clip text-on-background selection:bg-primary/30 selection:text-primary pt-24 pb-12">
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
                      <div className="flex-1">
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

                        {showEventDetails && (
                          <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-sm font-jakarta text-on-surface-variant">
                            {activeEvent.description && <p><strong className="text-white">Descripción:</strong> {activeEvent.description}</p>}
                            {activeEvent.end_date && <p><strong className="text-white">Finaliza:</strong> {new Date(activeEvent.end_date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>}
                            {activeEvent.dj && <p><strong className="text-white">DJ:</strong> {activeEvent.dj}</p>}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3 justify-end">
                        <Button variant="primary" className="w-full justify-center" onClick={() => setShowEventDetails(!showEventDetails)}>
                          {showEventDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          {showEventDetails ? 'Ocultar detalles' : 'Ver Detalles'}
                        </Button>
                        <button onClick={() => openWhatsApp(`Hola! Quiero consultar sobre mi evento (${activeEvent.type_event}) programado para el ${new Date(activeEvent.start_date).toLocaleDateString('es-ES')}.`)}
                          className="text-sm font-jakarta text-primary hover:underline w-full text-center flex items-center justify-center gap-1">
                          <Phone size={14} /> Contactar Planner
                        </button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-8 text-center bg-surface-container-low/40">
                    <p className="text-on-surface-variant font-jakarta">No tienes eventos próximos registrados.</p>
                    <Button variant="outline" className="mt-4" onClick={() => openWhatsApp('Hola! Quiero información para planificar un evento.')}>Contactar para reservar</Button>
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
                          const isPendingAction = ms.status === 'Pending' && idx === milestones.findIndex(m => m.status === 'Pending');
                          const isUpdating = updatingMilestone === ms.milestone_id;

                          return (
                            <div key={ms.milestone_id} className={`flex items-start gap-4 relative ${!isCompleted && !isPendingAction ? 'opacity-50' : ''}`}>
                              {idx < milestones.length - 1 && (
                                <div className="absolute left-3 top-6 bottom-[-24px] w-px bg-white/10"></div>
                              )}
                              
                              <button
                                onClick={() => handleToggleMilestone(ms, activeEvent.event_id)}
                                disabled={isUpdating}
                                className="shrink-0 mt-0.5 focus:outline-none group"
                              >
                                {isUpdating ? (
                                  <Loader2 size={15} className="text-primary animate-spin" />
                                ) : isCompleted ? (
                                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center group-hover:bg-secondary-fixed-dim transition-colors">
                                    <Check size={14} className="text-white" />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full border-2 border-white/30 group-hover:border-primary transition-colors flex items-center justify-center">
                                    <Circle size={10} className="text-transparent group-hover:text-primary/40 transition-colors" />
                                  </div>
                                )}
                              </button>

                              <div className="flex-1">
                                <h4 className={`${isCompleted ? 'text-white line-through opacity-70' : isPendingAction ? 'text-primary' : 'text-white'} font-semibold text-sm`}>
                                  {ms.title}
                                </h4>
                                <p className="text-xs text-on-surface-variant mt-1">
                                  {ms.description || (isCompleted ? 'Completado' : 'Pendiente')}
                                </p>
                                {ms.due_date && (
                                  <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                                    <Clock size={10} /> {new Date(ms.due_date).toLocaleDateString('es-ES')}
                                  </p>
                                )}
                                {ms.completed_at && (
                                  <p className="text-xs text-secondary mt-1">
                                    Completado el {new Date(ms.completed_at).toLocaleDateString('es-ES')}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-on-surface-variant">
                        {activeEvent.status === 'Confirmed'
                          ? 'Estamos preparando tu plan de preparativos. Pronto estará disponible aquí.'
                          : 'Las tareas de preparativos se generarán una vez que el evento sea confirmado.'}
                      </p>
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
                      invoices.map(inv => {
                        const computedStatus = inv.computed_status || inv.status || 'pending';
                        const balance = Number(inv.balance ?? inv.total ?? 0);
                        const isPaid = computedStatus === 'paid';
                        const isPartial = computedStatus === 'partial';
                        const hasPayments = Number(inv.total_paid || 0) > 0;
                        const isExpanded = expandedInvoice === inv.sale_id;

                        return (
                          <div key={inv.sale_id}>
                            <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-semibold text-white">Pago de Evento</h4>
                                <p className="text-xs text-on-surface-variant">Ref: #{inv.reference || inv.sale_id}</p>
                                <p className="text-sm font-bold text-white mt-0.5">
                                  ${Number(inv.total || 0).toFixed(2)}
                                  {isPaid && <span className="ml-2 text-xs text-secondary font-normal">✓ Pagado</span>}
                                  {isPartial && <span className="ml-2 text-xs text-amber-400 font-normal">Saldo: ${balance.toFixed(2)}</span>}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-3">
                                {hasPayments && (
                                  <button
                                    onClick={() => toggleInvoicePayments(inv.sale_id)}
                                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                                    title="Ver pagos"
                                  >
                                    <History size={14} className="text-on-surface-variant" />
                                  </button>
                                )}
                                {!isPaid ? (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => { setSelectedInvoice(inv); setShowPaymentModal(true); }}
                                  >
                                    <CreditCard size={14} className="mr-1" />
                                    Pagar
                                  </Button>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                                    <CheckCircle2 size={16} className="text-secondary" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Expanded payment history */}
                            {isExpanded && (
                              <div className="px-4 pb-4 pt-0">
                                <div className="bg-surface-container-highest/30 rounded-lg border border-white/5 overflow-hidden">
                                  <div className="px-3 py-2 border-b border-white/5">
                                    <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Historial de Pagos</p>
                                  </div>
                                  {paymentsByInvoice[inv.sale_id]?.length > 0 ? (
                                    <div className="divide-y divide-white/5">
                                      {paymentsByInvoice[inv.sale_id].map(p => (
                                        <div key={p.payment_id} className="px-3 py-2 flex items-center justify-between">
                                          <div>
                                            <p className="text-xs text-white font-semibold">${Number(p.amount).toFixed(2)}</p>
                                            <p className="text-[10px] text-on-surface-variant">{p.method} • {new Date(p.date).toLocaleDateString('es-ES')}</p>
                                          </div>
                                          <button
                                            onClick={() => downloadReceipt(p, inv.reference || inv.sale_id)}
                                            className="text-primary hover:text-primary-fixed-dim transition-colors"
                                            title="Descargar recibo"
                                          >
                                            <Download size={14} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="px-3 py-2 text-xs text-on-surface-variant">Sin pagos registrados</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
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
                  Si tienes dudas sobre tu evento o reserva, contáctanos directamente.
                </p>
                <Button variant="outline" className="w-full bg-surface/50 justify-center" onClick={() => openWhatsApp('Hola! Vengo del portal del cliente y necesito ayuda.')}>
                  <Phone size={16} className="mr-2" />
                  Contactar por WhatsApp
                </Button>
              </Card>

            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && selectedInvoice && (
        <PaymentModal
          invoice={selectedInvoice}
          onClose={() => { setShowPaymentModal(false); setSelectedInvoice(null); }}
          onSuccess={async () => {
            try {
              const apiUrl = import.meta.env.VITE_API_URL || 'https://api-lacasona.onrender.com/api';
              const invRes = await fetch(`${apiUrl}/client-portal/my-invoices`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (invRes.ok) {
                const invData = await invRes.json();
                setInvoices(invData);
              }
              if (expandedInvoice) {
                const data = await getInvoicePayments(expandedInvoice, token);
                setPaymentsByInvoice(prev => ({ ...prev, [expandedInvoice]: data }));
              }
            } catch (err) {
              console.error('Error refreshing invoices:', err);
            }
          }}
        />
      )}
    </>
  );
}
