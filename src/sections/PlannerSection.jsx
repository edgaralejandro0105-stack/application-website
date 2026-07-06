import React from 'react';
import { Card } from '../components/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { SideDecorations } from '../components/SideDecorations';
import { usePlannerLogic } from '../hooks/usePlannerLogic';
import { PlannerReserva } from '../components/Planner/PlannerReserva';
import { PlannerSuccess } from '../components/Planner/PlannerSuccess';
import { LoginSection } from './LoginSection';

export function PlannerSection() {
  const plannerLogic = usePlannerLogic();
  const { activeTab, setActiveTab, setConsultaResult, setSearchedConsulta, setErrorConsulta, step, initialDataError, isDataLoading, retryFetchData } = plannerLogic;

  return (
    <section id="planificador" className="py-16 bg-background relative z-10">
      <SideDecorations />
      <style>{`
        .form-glow-wrapper {
          position: relative;
          border-radius: 1rem;
          isolation: isolate;
        }
        .form-light {
          position: absolute;
          border-radius: 50%;
          filter: blur(150px);
          pointer-events: none;
          z-index: 0;
        }
      `}</style>
      <div className="max-w-[1200px] mx-auto px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-2 uppercase tracking-wide">
            {activeTab === 'reserva' ? 'Reserva tu Evento' : 'Acceso del Cliente'}
          </h2>
          <p className="font-jakarta text-on-surface-variant text-sm">
            {activeTab === 'reserva' ? 'Cotiza en tiempo real y reserva tu fecha.' : 'Inicia sesión para gestionar los detalles de tu evento.'}
            {step !== 3 && activeTab === 'consulta' && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('reserva');
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
          <div className="form-glow-wrapper">
            {/* Esfera Dorada (Elegante) */}
            <motion.div
              className="form-light"
              style={{ width: 600, height: 600, background: '#d4af37', left: '-15%', top: '-20%' }}
              animate={{
                opacity: [0.05, 0.12, 0.05],
                y: [0, 30, 0],
                x: [0, -20, 0]
              }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />

            {/* Esfera Violeta Profundo (Contraste) */}
            <motion.div
              className="form-light"
              style={{ width: 500, height: 500, background: '#4c1d95', right: '-10%', bottom: '-15%' }}
              animate={{
                opacity: [0.05, 0.15, 0.05],
                y: [0, -40, 0],
                x: [0, 30, 0]
              }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            />

            <Card className="max-w-4xl mx-auto p-8 border-white/10 bg-surface-container-low/40 overflow-hidden relative z-10">
              <AnimatePresence mode="wait">
                {initialDataError ? (
                  <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-playfair text-xl font-bold text-white mb-2">Error de Conexión</h3>
                    <p className="font-jakarta text-on-surface-variant text-sm mb-6 max-w-sm">
                      No pudimos conectar con el servidor para cargar los datos. Por favor, intenta de nuevo.
                    </p>
                    <button onClick={retryFetchData} className="px-6 py-2 bg-primary text-on-primary rounded-md font-semibold font-jakarta hover:bg-primary-fixed transition-colors">
                      Reintentar conexión
                    </button>
                  </motion.div>
                ) : isDataLoading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-16 text-center">
                    <svg className="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="font-jakarta text-on-surface-variant text-sm animate-pulse">Conectando con el servidor...</p>
                  </motion.div>
                ) : step === 3 ? (
                  <PlannerSuccess logic={plannerLogic} />
                ) : activeTab === 'consulta' ? (
                  <LoginSection />
                ) : (
                  <PlannerReserva logic={plannerLogic} />
                )}
              </AnimatePresence>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
