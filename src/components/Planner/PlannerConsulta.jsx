import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../Button';

export function PlannerConsulta({ logic }) {
  const {
    consultaCorreo,
    setConsultaCorreo,
    handleConsulta,
    loadingConsulta,
    errorConsulta,
    searchedConsulta,
    consultaResult
  } = logic;

  return (
    <motion.div key="consulta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="flex flex-col gap-8">
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
            disabled={loadingConsulta}
            className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary placeholder:text-outline-variant disabled:opacity-50"
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
                  const cleanDateStr = event.start_date.split('T')[0];
                  const [y, m, d] = cleanDateStr.split('-').map(Number);
                  const localDateObj = new Date(y, m - 1, d);
                  
                  const formattedDate = localDateObj.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });

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
    </motion.div>
  );
}
