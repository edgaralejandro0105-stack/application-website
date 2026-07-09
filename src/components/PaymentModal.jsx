import React, { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Landmark, CreditCard, CheckCircle2, AlertCircle, Loader2, Copy, Check, Eye, EyeOff, Building, MapPin, Clock } from 'lucide-react';
import { Button } from './Button';
import { usePayment } from '../hooks/usePayment';
import { useClientAuth } from '../context/ClientAuthContext';

const PAYMENT_METHODS = [
  { id: 'Efectivo', label: 'Efectivo', icon: DollarSign, description: 'Paga en efectivo en nuestras instalaciones' },
  { id: 'Transferencia', label: 'Transferencia', icon: Landmark, description: 'Paga desde tu banco por transferencia' },
  { id: 'Punto de Venta', label: 'Tarjeta de Crédito', icon: CreditCard, description: 'Paga con tarjeta de crédito o débito' },
];

const PROCESSING_STEPS = [
  { label: 'Validando datos', duration: 600 },
  { label: 'Procesando pago', duration: 900 },
  { label: 'Confirmando', duration: 600 },
];

const BANK_ACCOUNTS = [
  { bank: 'Banco de Venezuela', type: 'Corriente', account: '0134-0123-45-1234567890', holder: 'Eventos Francisco C.A.', rif: 'J-12345678-9' },
];

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

export function PaymentModal({ invoice, onClose, onSuccess }) {
  const { token } = useClientAuth();
  const { simulatePayment, processing, result, resetResult } = usePayment();
  const [step, setStep] = useState('method');
  const [selectedMethod, setSelectedMethod] = useState(() => localStorage.getItem('payment_method') || null);
  const [amount, setAmount] = useState(Number(invoice?.balance || invoice?.total || 0));
  const [processingStep, setProcessingStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [confirmCash, setConfirmCash] = useState(false);

  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [showCvc, setShowCvc] = useState(false);

  useEffect(() => {
    return () => resetResult();
  }, []);

  useEffect(() => {
    if (selectedMethod) localStorage.setItem('payment_method', selectedMethod);
  }, [selectedMethod]);

  useEffect(() => {
    if (result?.success) {
      const timer = setTimeout(() => {
        onSuccess?.(result);
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [result, onSuccess, onClose]);

  const runProcessingAnimation = useCallback(async () => {
    setStep('processing');
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setProcessingStep(i);
      await new Promise(r => setTimeout(r, PROCESSING_STEPS[i].duration));
    }
  }, []);

  const handlePay = useCallback(async () => {
    if (!selectedMethod || !invoice) return;
    await runProcessingAnimation();
    await simulatePayment(invoice.sale_id, amount, selectedMethod, token);
  }, [selectedMethod, invoice, amount, simulatePayment, token, runProcessingAnimation]);

  const total = Number(invoice?.total || 0);
  const balance = Number(invoice?.balance ?? total);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetToStart = () => {
    setStep('method');
    setProcessingStep(0);
    setCardForm({ number: '', expiry: '', cvc: '', name: '' });
    setConfirmCash(false);
    resetResult();
  };

  const canPay = () => {
    if (!selectedMethod || amount <= 0) return false;
    if (selectedMethod === 'Punto de Venta') {
      return cardForm.number.replace(/\D/g, '').length === 16 && cardForm.expiry.length === 5 && cardForm.cvc.length >= 3 && cardForm.name.length > 2;
    }
    if (selectedMethod === 'Efectivo') return confirmCash;
    return true;
  };

  const renderCardPreview = () => (
    <div className="relative w-full h-44 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 p-5 text-white overflow-hidden shadow-lg mb-4">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
          <Building size={28} className="opacity-80" />
          <div className="text-right">
            <p className="text-[10px] opacity-60">Monto</p>
            <p className="font-bold text-lg">${Number(amount).toFixed(2)}</p>
          </div>
        </div>
        <div>
          <p className="text-lg tracking-widest font-mono">
            {cardForm.number || '•••• •••• •••• ••••'}
          </p>
          <div className="flex justify-between mt-2 text-xs">
            <div>
              <p className="opacity-60">Vence</p>
              <p className="font-mono">{cardForm.expiry || 'MM/AA'}</p>
            </div>
            <div className="text-right">
              <p className="opacity-60">Titular</p>
              <p className="text-sm truncate max-w-[150px]">{cardForm.name || 'NOMBRE DEL TITULAR'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md bg-surface-container border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0">
            <h3 className="font-playfair text-lg font-bold text-white">
              {result?.success ? 'Pago Realizado' : step === 'processing' ? 'Procesando...' : 'Pagar Recibo'}
            </h3>
            <button onClick={onClose} className="text-on-surface-variant hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
          {result?.success ? (
            /* ─── SUCCESS ─── */
            <div className="p-6">
              <div className="bg-surface-container-low/40 rounded-xl border border-secondary/20 p-5">
                <div className="text-center mb-4">
                  <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="text-secondary w-7 h-7" />
                  </div>
                  <h4 className="font-playfair text-lg font-bold text-white">Pago Exitoso</h4>
                  <p className="text-xs text-on-surface-variant mt-1">Tu pago ha sido registrado</p>
                </div>
                <div className="border-t border-white/5 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Transacción</span>
                    <span className="text-white font-mono text-xs">{result.transaction_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Método</span>
                    <span className="text-white">{result.transaction?.method || selectedMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Monto</span>
                    <span className="text-white font-bold">${Number(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Fecha</span>
                    <span className="text-white">{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Referencia</span>
                    <span className="text-white">#{invoice.reference}</span>
                  </div>
                </div>
                {balance > 0 && (
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
                    <p className="text-xs text-amber-400">Saldo pendiente: ${balance.toFixed(2)}</p>
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-white/5 text-center">
                  <p className="text-[10px] text-on-surface-variant">Recibo generado electrónicamente</p>
                </div>
              </div>
            </div>
          ) : result && !result.success ? (
            /* ─── ERROR ─── */
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-error w-8 h-8" />
              </div>
              <h4 className="font-playfair text-xl font-bold text-white mb-2">Error</h4>
              <p className="text-sm text-on-surface-variant mb-4">{result.message}</p>
              <Button variant="outline" onClick={resetToStart}>Reintentar</Button>
            </div>
          ) : step === 'processing' ? (
            /* ─── PROCESSING ─── */
            <div className="p-10 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"
                  style={{ animationDuration: '0.8s' }}
                ></div>
                <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
                  {processingStep === 0 && <Loader2 size={24} className="text-primary animate-spin" />}
                  {processingStep === 1 && <Loader2 size={24} className="text-primary animate-spin" style={{ animationDuration: '0.6s' }} />}
                  {processingStep === 2 && <CheckCircle2 size={24} className="text-secondary" />}
                </div>
              </div>
              <div className="space-y-3">
                {PROCESSING_STEPS.map((s, i) => (
                  <div key={i} className={`flex items-center gap-3 transition-all duration-300 ${i <= processingStep ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i < processingStep ? 'bg-secondary text-white' : i === processingStep ? 'bg-primary text-white animate-pulse' : 'bg-white/10 text-on-surface-variant'
                    }`}>
                      {i < processingStep ? <Check size={14} /> : i + 1}
                    </div>
                    <p className={`text-sm ${i <= processingStep ? 'text-white' : 'text-on-surface-variant'}`}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ─── FORM ─── */
            <>
              <div className="p-5 bg-surface-container-low/40 mx-5 mt-5 rounded-xl border border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-on-surface-variant">Referencia</span>
                  <span className="text-sm text-white font-semibold">#{invoice.reference}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface-variant">Total</span>
                  <span className="text-lg font-bold text-white">${total.toFixed(2)}</span>
                </div>
                {balance < total && (
                  <div className="flex justify-between items-center mt-1 pt-2 border-t border-white/5">
                    <span className="text-sm text-on-surface-variant">Saldo pendiente</span>
                    <span className="text-sm font-semibold text-amber-400">${balance.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-3 font-semibold">
                  Selecciona un método de pago
                </p>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        onClick={() => { setSelectedMethod(method.id); setConfirmCash(false); }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-white'
                            : 'border-white/5 bg-surface-container-low/30 text-on-surface-variant hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-primary/20 text-primary' : 'bg-white/5 text-on-surface-variant'
                        }`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{method.label}</p>
                          <p className="text-xs opacity-70">{method.description}</p>
                        </div>
                        {isSelected && (
                          <div className="ml-auto w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="px-5 pb-3">
                <label className="text-xs text-on-surface-variant uppercase tracking-wider mb-2 block font-semibold">Monto a pagar</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={balance}
                    value={amount}
                    onChange={(e) => setAmount(Math.min(Number(e.target.value), balance))}
                    className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-lg pl-8 pr-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {selectedMethod === 'Punto de Venta' && (
                <div className="px-5 pb-3 space-y-3">
                  {renderCardPreview()}
                  <input
                    placeholder="Número de tarjeta"
                    value={cardForm.number}
                    onChange={(e) => setCardForm({ ...cardForm, number: formatCardNumber(e.target.value) })}
                    className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors font-mono"
                    maxLength={19}
                  />
                  <div className="flex gap-3">
                    <input
                      placeholder="MM/AA"
                      value={cardForm.expiry}
                      onChange={(e) => setCardForm({ ...cardForm, expiry: formatExpiry(e.target.value) })}
                      className="flex-1 bg-surface-container-highest/50 border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors font-mono"
                      maxLength={5}
                    />
                    <div className="relative flex-1">
                      <input
                        type={showCvc ? 'text' : 'password'}
                        placeholder="CVC"
                        value={cardForm.cvc}
                        onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors font-mono"
                        maxLength={4}
                      />
                      <button
                        onClick={() => setShowCvc(!showCvc)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white"
                      >
                        {showCvc ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <input
                    placeholder="Nombre del titular"
                    value={cardForm.name}
                    onChange={(e) => setCardForm({ ...cardForm, name: e.target.value.toUpperCase() })}
                    className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              )}

              {selectedMethod === 'Transferencia' && (
                <div className="px-5 pb-3 space-y-3">
                  <div className="bg-surface-container-low/40 rounded-xl border border-white/5 p-4 space-y-3">
                    <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Datos para la transferencia</p>
                    {BANK_ACCOUNTS.map((acc, i) => (
                      <div key={i} className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-on-surface-variant">Banco</span>
                          <span className="text-white font-semibold">{acc.bank}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-on-surface-variant">Tipo</span>
                          <span className="text-white">{acc.type}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-on-surface-variant">N° Cuenta</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-mono text-xs">{acc.account}</span>
                            <button onClick={() => copyToClipboard(acc.account)} className="text-primary hover:text-primary-fixed-dim">
                              {copied ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-on-surface-variant">Titular</span>
                          <span className="text-white text-xs">{acc.holder}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-on-surface-variant">RIF</span>
                          <span className="text-white text-xs">{acc.rif}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                    <p className="text-xs text-amber-400 text-center">
                      Transfiere el monto exacto y luego confirma el pago aquí. Te notificaremos cuando recibamos la transferencia.
                    </p>
                  </div>
                </div>
              )}

              {selectedMethod === 'Efectivo' && (
                <div className="px-5 pb-3 space-y-3">
                  <div className="bg-surface-container-low/40 rounded-xl border border-white/5 p-4">
                    <p className="text-sm text-on-surface-variant mb-3">
                      Puedes realizar el pago en efectivo en nuestras instalaciones. Una vez registrado, se reflejará automáticamente en tu cuenta.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2 text-on-surface-variant">
                        <MapPin size={14} className="mt-0.5 shrink-0 text-primary" />
                        <span>Dirección: [Dirección de La Casona]</span>
                      </div>
                      <div className="flex items-start gap-2 text-on-surface-variant">
                        <Clock size={14} className="mt-0.5 shrink-0 text-primary" />
                        <span>Horario: [Horario de atención]</span>
                      </div>
                    </div>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmCash}
                      onChange={(e) => setConfirmCash(e.target.checked)}
                      className="mt-0.5 accent-primary"
                    />
                    <span className="text-sm text-on-surface-variant">
                      Confirmo que pagaré este monto en efectivo en las instalaciones
                    </span>
                  </label>
                </div>
              )}

              <div className="p-5 pt-3 flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1 justify-center">
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePay}
                  disabled={!canPay()}
                  className="flex-1 justify-center"
                >
                  {`Pagar $${Number(amount).toFixed(2)}`}
                </Button>
              </div>
            </>
          )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
