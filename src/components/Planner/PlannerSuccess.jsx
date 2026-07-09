import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../Button';
import { Loader2, CheckCircle2, AlertCircle, CreditCard, DollarSign, Landmark, X } from 'lucide-react';
import { usePayment } from '../../hooks/usePayment';

const PAYMENT_METHODS = [
  { id: 'Efectivo', label: 'Efectivo', icon: DollarSign },
  { id: 'Transferencia', label: 'Transferencia', icon: Landmark },
  { id: 'Punto de Venta', label: 'Tarjeta de Crédito', icon: CreditCard },
];

export function PlannerSuccess({ logic }) {
  const { resetForm, reservationResult } = logic;
  const { simulatePayment, processing, result, resetResult } = usePayment();
  const [showPayment, setShowPayment] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [token, setToken] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const sale = reservationResult?.sale;
  const event = reservationResult?.event;
  const suggestedAdvance = sale ? Math.round(Number(sale.total) * 0.3) : 0;

  const handleOpenPayment = async () => {
    setLoggingIn(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://api-lacasona.onrender.com/api';
      const password = `${event?.name?.charAt(0).toUpperCase() || ''}${event?.doc_id || ''}`;
      const loginRes = await fetch(`${apiUrl}/client-portal/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: event?.email || '', password }),
      });
      if (loginRes.ok) {
        const loginData = await loginRes.json();
        setToken(loginData.token);
        setAdvanceAmount(suggestedAdvance);
        setShowPayment(true);
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
    } finally {
      setLoggingIn(false);
    }
  };

  const handlePay = async () => {
    if (!selectedMethod || !token || !sale) return;
    await simulatePayment(sale.sale_id, advanceAmount, selectedMethod, token);
  };

  const handleClose = () => {
    setShowPayment(false);
    setSelectedMethod(null);
    resetResult();
  };

  const total = Number(sale?.total || 0);

  return (
    <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} className="flex flex-col items-center justify-center py-12 text-center">
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
      <p className="font-jakarta text-on-surface-variant max-w-md mx-auto mb-6 leading-relaxed">
        Tu solicitud ha sido guardada. Un miembro de nuestro equipo se pondrá en contacto contigo para confirmar los detalles.
      </p>

      {/* Advance Payment Option */}
      {sale && !showPayment && !loggingIn && !result?.success && (
        <div className="bg-surface-container-low/40 border border-primary/20 rounded-xl p-5 max-w-sm w-full mb-6">
          <p className="text-sm text-on-surface-variant mb-1">Total estimado</p>
          <p className="text-2xl font-bold text-white mb-3">${total.toFixed(2)}</p>
          <p className="text-sm text-on-surface-variant mb-4">
            ¿Quieres apartar tu fecha con un adelanto? Con tan solo <strong className="text-primary">${suggestedAdvance.toFixed(2)}</strong> (30%) confirmas tu reserva.
          </p>
          <Button variant="primary" className="w-full justify-center" onClick={handleOpenPayment}>
            <CreditCard size={16} className="mr-1" />
            Pagar adelanto ahora
          </Button>
        </div>
      )}

      {loggingIn && (
        <div className="flex items-center gap-2 text-on-surface-variant mb-6">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Preparando pago...</span>
        </div>
      )}

      {result?.success && (
        <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-5 max-w-sm w-full mb-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 size={20} className="text-secondary shrink-0" />
            <p className="text-white font-semibold">Adelanto procesado</p>
          </div>
          <p className="text-xs text-on-surface-variant">
            Transacción: {result.transaction_id} — ${Number(advanceAmount).toFixed(2)}
          </p>
        </div>
      )}

      {result && !result.success && (
        <div className="bg-error/10 border border-error/20 rounded-xl p-4 max-w-sm w-full mb-6 flex items-center gap-3">
          <AlertCircle size={18} className="text-error shrink-0" />
          <p className="text-sm text-on-surface-variant">{result.message}</p>
        </div>
      )}

      <Button variant="outline" onClick={resetForm}>Cerrar</Button>

      {/* Payment Modal Inline */}
      <AnimatePresence>
        {showPayment && !result?.success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm bg-surface-container border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <h3 className="font-playfair text-base font-bold text-white">Adelanto</h3>
                <button onClick={handleClose} className="text-on-surface-variant hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5">
                <p className="text-xs text-on-surface-variant mb-2">Total del evento</p>
                <p className="text-xl font-bold text-white mb-4">${total.toFixed(2)}</p>

                <label className="text-xs text-on-surface-variant uppercase tracking-wider mb-2 block font-semibold">Monto del adelanto</label>
                <div className="relative mb-4">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold">$</span>
                  <input
                    type="number"
                    min="0.01"
                    max={total}
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(Math.min(Number(e.target.value), total))}
                    className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-lg pl-8 pr-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="flex gap-2 mb-4">
                  {[10, 30, 50].map(pct => (
                    <button
                      key={pct}
                      onClick={() => setAdvanceAmount(total * pct / 100)}
                      className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-all ${
                        advanceAmount === total * pct / 100
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-white/10 text-on-surface-variant hover:border-white/30'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>

                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-3 font-semibold">Método de pago</p>
                <div className="space-y-2 mb-4">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                          isSelected ? 'border-primary bg-primary/10 text-white' : 'border-white/5 bg-surface-container-low/30 text-on-surface-variant hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-primary/20 text-primary' : 'bg-white/5 text-on-surface-variant'}`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-sm font-semibold">{method.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleClose} className="flex-1 justify-center">Cancelar</Button>
                  <Button variant="primary" onClick={handlePay} disabled={!selectedMethod || processing || advanceAmount <= 0} className="flex-1 justify-center">
                    {processing ? (
                      <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" />Procesando</span>
                    ) : (
                      `Pagar $${advanceAmount.toFixed(2)}`
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
