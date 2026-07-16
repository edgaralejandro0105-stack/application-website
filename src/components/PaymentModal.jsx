import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Landmark, CreditCard, CheckCircle2, AlertCircle,
  Loader2, Copy, Check, Eye, EyeOff,
  ChevronLeft, ChevronRight, Smartphone, Zap, Download, Share2,
  ShieldCheck, ArrowRight
} from 'lucide-react';
import { Button } from './Button';
import { usePayment } from '../hooks/usePayment';
import { useClientAuth } from '../context/ClientAuthContext';

/* ─── Constants ──────────────────────────────────────────────────────────────── */

const VENEZUELAN_BANKS = [
  'Banco de Venezuela',
  'Banesco',
  'Banco Mercantil',
  'BBVA Provincial',
  'Banco Exterior',
  'Banco Occidental de Descuento (BOD)',
  'Banco Nacional de Crédito (BNC)',
  'Banco del Tesoro',
  'Banco Sofitasa',
  'Banco Caroní',
  '100% Banco',
  'Bancamiga',
  'Mi Banco',
];

const PAYMENT_METHODS = [
  { id: 'Transferencia', label: 'Transferencia', icon: Landmark, description: 'Transferencia bancaria nacional', color: 'from-blue-500 to-blue-700' },
  { id: 'Punto de Venta', label: 'Tarjeta de Crédito', icon: CreditCard, description: 'Paga con tarjeta de crédito o débito', color: 'from-violet-500 to-purple-700' },
  { id: 'Pago Móvil', label: 'Pago Móvil', icon: Smartphone, description: 'Paga desde tu banco por pago móvil', color: 'from-orange-500 to-red-600' },
  { id: 'Zelle', label: 'Zelle', icon: Zap, description: 'Envía tu pago por Zelle en dólares', color: 'from-indigo-500 to-blue-800' },
];

const STEPS = [
  { key: 'method', label: 'Método' },
  { key: 'details', label: 'Detalles' },
  { key: 'confirm', label: 'Confirmar' },
  { key: 'processing', label: 'Procesando' },
  { key: 'result', label: 'Resultado' },
];

const PROCESSING_STEPS = [
  { label: 'Validando datos del pago', duration: 700 },
  { label: 'Conectando con el banco', duration: 1000 },
  { label: 'Procesando transacción', duration: 800 },
  { label: 'Confirmando pago', duration: 500 },
];

const BANK_ACCOUNTS = [
  { bank: 'Banco de Venezuela', type: 'Corriente', account: '0134-0123-45-1234567890', holder: 'Eventos Francisco C.A.', rif: 'J-12345678-9' },
];

const PAGO_MOVIL_DATA = {
  phone: '0412-7887461',
  bank: 'Banco de Venezuela',
  docId: 'J-12345678-9',
};

const ZELLE_DATA = {
  email: 'pagos@lacasona.com',
  name: 'Eventos Francisco',
};

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

function detectCardBrand(number) {
  const clean = number.replace(/\D/g, '');
  if (/^4/.test(clean)) return 'visa';
  if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'mastercard';
  return null;
}

function getMethodById(id) {
  return PAYMENT_METHODS.find(m => m.id === id);
}

/* ─── Confetti Canvas ────────────────────────────────────────────────────────── */

function ConfettiCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ['#d0bcff', '#4edea3', '#ffb2b7', '#a078ff', '#ff516a', '#FFD700', '#00E5FF'];
    const particles = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 40,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 14 - 4,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.25 + Math.random() * 0.15,
        opacity: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      });
    }

    let animId;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.opacity = Math.max(0, p.opacity - 0.005);

        if (p.opacity > 0 && p.y < canvas.height + 20) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      });
      if (alive) animId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" />;
}

/* ─── Stepper ────────────────────────────────────────────────────────────────── */

function Stepper({ currentIndex }) {
  const visibleSteps = STEPS.slice(0, 3); // Only show first 3 in stepper
  return (
    <div className="flex items-center justify-center gap-1 px-5 pt-4 pb-2">
      {visibleSteps.map((step, i) => {
        const isActive = i === Math.min(currentIndex, 2);
        const isCompleted = i < currentIndex;
        return (
          <React.Fragment key={step.key}>
            <div className="flex items-center gap-1.5">
              <motion.div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-secondary text-white'
                    : isActive
                      ? 'bg-primary text-on-primary ring-2 ring-primary/30'
                      : 'bg-white/5 text-on-surface-variant'
                }`}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                {isCompleted ? <Check size={12} /> : i + 1}
              </motion.div>
              <span className={`text-[10px] font-semibold tracking-wider uppercase hidden sm:block ${
                isActive ? 'text-white' : isCompleted ? 'text-secondary' : 'text-on-surface-variant/50'
              }`}>
                {step.label}
              </span>
            </div>
            {i < visibleSteps.length - 1 && (
              <div className="flex-1 max-w-8 h-px mx-1">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ background: 'rgba(255,255,255,0.1)' }}
                  animate={{
                    background: isCompleted
                      ? 'linear-gradient(90deg, #4edea3, #4edea3)'
                      : 'rgba(255,255,255,0.1)',
                  }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Card Brand SVGs ────────────────────────────────────────────────────────── */

function VisaLogo({ className = '' }) {
  return (
    <svg viewBox="0 0 48 16" className={className} fill="currentColor">
      <path d="M19.4 1.2L15.8 14.8H12.6L16.2 1.2H19.4ZM33.2 9.8L35 4.6L36 9.8H33.2ZM37 14.8H40L37.4 1.2H34.8C34 1.2 33.2 1.6 32.8 2.4L27.4 14.8H30.8L31.4 13H35.6L37 14.8ZM29 10.2C29 6.4 23.6 6.2 23.6 4.6C23.6 4 24.2 3.4 25.4 3.2C26 3.2 27.6 3 29.4 4L30.2 1.6C29.2 1.2 28 1 26.4 1C23.2 1 20.8 2.8 20.8 5.4C20.8 7.4 22.6 8.4 23.8 9C25.2 9.8 25.6 10.2 25.6 10.8C25.6 11.8 24.4 12.2 23.4 12.2C21.6 12.2 20.6 11.8 19.8 11.4L19 13.8C19.8 14.2 21.4 14.6 23 14.6C26.4 14.8 28.8 13 29 10.2ZM12.6 1.2L7.4 14.8H4L1.4 3.8C1.2 3 1 2.6 0.4 2.2C-0.6 1.6 0.2 1.4 0.2 1.4L0 1.2H5.2C6 1.2 6.6 1.8 6.8 2.6L8 9.6L11.2 1.2H12.6Z" />
    </svg>
  );
}

function MastercardLogo({ className = '' }) {
  return (
    <svg viewBox="0 0 40 24" className={className}>
      <circle cx="15" cy="12" r="10" fill="#EB001B" opacity="0.9" />
      <circle cx="25" cy="12" r="10" fill="#F79E1B" opacity="0.9" />
      <path d="M20 4.6a10 10 0 000 14.8 10 10 0 000-14.8z" fill="#FF5F00" opacity="0.9" />
    </svg>
  );
}

/* ─── Animated Card Preview ──────────────────────────────────────────────────── */

function AnimatedCardPreview({ cardForm, amount, isFlipped }) {
  const brand = detectCardBrand(cardForm.number);

  return (
    <div className="relative w-full h-48 mb-5" style={{ perspective: '1000px' }}>
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-5 text-white overflow-hidden shadow-2xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-4 left-5 w-10 h-7 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-80" />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div />
              <div className="flex items-center gap-2">
                {brand === 'visa' && <VisaLogo className="w-12 h-5 text-white/90" />}
                {brand === 'mastercard' && <MastercardLogo className="w-10 h-6" />}
                {!brand && (
                  <div className="text-right">
                    <p className="text-[9px] opacity-50 uppercase tracking-widest">Monto</p>
                    <p className="font-bold text-sm">${Number(amount).toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-auto">
              <p className="text-lg tracking-[0.25em] font-mono mb-3">
                {cardForm.number || '•••• •••• •••• ••••'}
              </p>
              <div className="flex justify-between text-xs">
                <div>
                  <p className="opacity-50 text-[9px] uppercase">Vence</p>
                  <p className="font-mono">{cardForm.expiry || 'MM/AA'}</p>
                </div>
                <div className="text-right">
                  <p className="opacity-50 text-[9px] uppercase">Titular</p>
                  <p className="text-sm truncate max-w-[180px]">{cardForm.name || 'NOMBRE DEL TITULAR'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 overflow-hidden shadow-2xl"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="w-full h-10 bg-black/60 mt-6" />
          <div className="px-5 mt-5 flex items-center justify-end gap-3">
            <div className="flex-1 h-8 bg-white/10 rounded" />
            <div className="bg-white/20 rounded px-3 py-1.5 font-mono text-white text-sm tracking-wider min-w-[50px] text-center">
              {cardForm.cvc || '•••'}
            </div>
          </div>
          <div className="absolute bottom-4 right-5">
            {brand === 'visa' && <VisaLogo className="w-12 h-5 text-white/60" />}
            {brand === 'mastercard' && <MastercardLogo className="w-10 h-6 opacity-60" />}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Receipt Generator ──────────────────────────────────────────────────────── */

function generateReceiptHTML(payment, invoice, amount, method) {
  const txId = payment?.transaction_id || `SIM-${Date.now()}`;
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Recibo #${txId}</title>
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
    .header h1 { font-size: 20px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.3px; }
    .header p { font-size: 12px; color: #888; margin-top: 4px; }
    .status-badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      background: #e8f5e9;
      color: #2e7d32;
      margin-top: 8px;
    }
    .info-grid { display: flex; flex-direction: column; gap: 12px; }
    .info-row { display: flex; justify-content: space-between; align-items: center; }
    .info-row .label { font-size: 13px; color: #888; }
    .info-row .value { font-size: 14px; font-weight: 600; color: #1a1a1a; }
    .info-row .value.amount { font-size: 22px; font-weight: 700; color: #2e7d32; }
    .divider { height: 1px; background: #f0f0f0; margin: 8px 0; }
    .footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 2px solid #f0f0f0;
      font-size: 11px;
      color: #aaa;
      line-height: 1.6;
    }
    .footer strong { color: #666; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>La Casona</h1>
      <p>Eventos Francisco C.A.</p>
      <div class="status-badge">Pagado</div>
    </div>
    <div class="info-grid">
      <div class="info-row">
        <span class="label">Monto</span>
        <span class="value amount">$${Number(amount).toFixed(2)}</span>
      </div>
      <div class="divider"></div>
      <div class="info-row">
        <span class="label">Transacci\u00f3n</span>
        <span class="value">${txId}</span>
      </div>
      <div class="info-row">
        <span class="label">Referencia</span>
        <span class="value">#${invoice?.reference || invoice?.sale_id || 'N/A'}</span>
      </div>
      <div class="info-row">
        <span class="label">M\u00e9todo</span>
        <span class="value">${method}</span>
      </div>
      <div class="info-row">
        <span class="label">Fecha</span>
        <span class="value">${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
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
}

function downloadReceipt(result, invoice, amount, method) {
  const html = generateReceiptHTML(result, invoice, amount, method);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `recibo-${result?.transaction_id || 'pago'}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── Step Transition Wrapper ────────────────────────────────────────────────── */

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 80 : -80, opacity: 0 }),
};

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export function PaymentModal({ invoice, onClose, onSuccess }) {
  const { token } = useClientAuth();
  const { simulatePayment, processing, result, resetResult } = usePayment();

  // State
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState(() => localStorage.getItem('payment_method') || null);
  const [amount, setAmount] = useState(Number(invoice?.balance || invoice?.total || 0));
  const [processingStep, setProcessingStep] = useState(0);
  const [copied, setCopied] = useState(null);
  const [countdown, setCountdown] = useState(6);
  const [cardFlipped, setCardFlipped] = useState(false);

  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [showCvc, setShowCvc] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Payment detail fields (non-card methods)
  const [transferReference, setTransferReference] = useState('');
  const [senderBank, setSenderBank] = useState('');
  const [pmReference, setPmReference] = useState('');
  const [pmSenderBank, setPmSenderBank] = useState('');
  const [pmSenderPhone, setPmSenderPhone] = useState('');
  const [zelleReference, setZelleReference] = useState('');

  const step = STEPS[stepIndex]?.key;
  const total = Number(invoice?.total || 0);
  const balance = Number(invoice?.balance ?? total);
  const methodInfo = getMethodById(selectedMethod);

  // Lock body scroll while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => resetResult();
  }, []);

  // Persist selected method
  useEffect(() => {
    if (selectedMethod) localStorage.setItem('payment_method', selectedMethod);
  }, [selectedMethod]);

  // Success countdown + auto-close
  useEffect(() => {
    if (result?.success) {
      setStepIndex(4);
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            onSuccess?.(result);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
    if (result && !result.success) {
      setStepIndex(4);
    }
  }, [result]);

  // Navigation
  const goNext = useCallback(() => {
    setDirection(1);
    setStepIndex(prev => Math.min(prev + 1, STEPS.length - 1));
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStepIndex(prev => Math.max(prev - 1, 0));
  }, []);

  // Copy helper
  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // Processing animation
  const runProcessingAnimation = useCallback(async () => {
    setDirection(1);
    setStepIndex(3);
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setProcessingStep(i);
      await new Promise(r => setTimeout(r, PROCESSING_STEPS[i].duration));
    }
  }, []);

  // Execute payment
  const handlePay = useCallback(async () => {
    if (!selectedMethod || !invoice) return;
    const extra = {};
    if (selectedMethod === 'Transferencia') {
      extra.reference = transferReference;
      extra.sender_bank = senderBank;
    } else if (selectedMethod === 'Pago Móvil') {
      extra.reference = pmReference;
      extra.sender_bank = pmSenderBank;
      extra.sender_phone = pmSenderPhone;
    } else if (selectedMethod === 'Zelle') {
      extra.reference = zelleReference;
    }
    await runProcessingAnimation();
    await simulatePayment(invoice.sale_id, amount, selectedMethod, token, extra);
  }, [selectedMethod, invoice, amount, simulatePayment, token, runProcessingAnimation, transferReference, senderBank, pmReference, pmSenderBank, pmSenderPhone, zelleReference]);

  // Reset
  const resetToStart = () => {
    setStepIndex(0);
    setDirection(-1);
    setProcessingStep(0);
    setCardForm({ number: '', expiry: '', cvc: '', name: '' });
    setTransferReference('');
    setSenderBank('');
    setPmReference('');
    setPmSenderBank('');
    setPmSenderPhone('');
    setZelleReference('');
    setCountdown(6);
    setCardFlipped(false);
    setFieldErrors({});
    resetResult();
  };

  // Validations
  const validateCardField = (field, value) => {
    const errors = { ...fieldErrors };
    switch (field) {
      case 'number':
        errors.number = value.replace(/\D/g, '').length === 16 ? null : 'incomplete';
        break;
      case 'expiry':
        errors.expiry = value.length === 5 ? null : 'incomplete';
        break;
      case 'cvc':
        errors.cvc = value.length >= 3 ? null : 'incomplete';
        break;
      case 'name':
        errors.name = value.length > 2 ? null : 'incomplete';
        break;
    }
    setFieldErrors(errors);
  };

  const canProceedFromDetails = useMemo(() => {
    if (!selectedMethod || amount <= 0) return false;
    if (selectedMethod === 'Punto de Venta') {
      return (
        cardForm.number.replace(/\D/g, '').length === 16 &&
        cardForm.expiry.length === 5 &&
        cardForm.cvc.length >= 3 &&
        cardForm.name.length > 2
      );
    }
    if (selectedMethod === 'Transferencia') {
      return senderBank.length > 0 && transferReference.trim().length >= 4;
    }
    if (selectedMethod === 'Pago Móvil') {
      return pmSenderBank.length > 0 && pmReference.trim().length >= 4 && pmSenderPhone.trim().length >= 10;
    }
    if (selectedMethod === 'Zelle') {
      return zelleReference.trim().length >= 4;
    }
    return true;
  }, [selectedMethod, amount, cardForm, senderBank, transferReference, pmSenderBank, pmReference, pmSenderPhone, zelleReference]);

  const getFieldClass = (field) => {
    if (!fieldErrors[field]) return 'border-outline-variant focus:border-primary';
    if (fieldErrors[field] === 'incomplete') return 'border-outline-variant focus:border-primary';
    return 'border-outline-variant focus:border-primary';
  };

  // Share by WhatsApp
  const shareByWhatsApp = () => {
    const userRef = transferReference || pmReference || zelleReference || 'N/A';
    const msg = `✅ He realizado un pago de $${Number(amount).toFixed(2)} para mi evento.\n📋 Factura: #${invoice?.reference || invoice?.sale_id}\n💳 Método: ${selectedMethod}\n🔖 Referencia: ${userRef}\n🔗 Transacción: ${result?.transaction_id || 'N/A'}`;
    window.open(`https://wa.me/584127887461?text=${encodeURIComponent(msg)}`, '_blank');
  };

  /* ─────────────────── RENDER STEPS ─────────────────── */

  const renderMethodStep = () => (
    <div className="p-5 space-y-3">
      <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-1">
        ¿Cómo deseas pagar?
      </p>
      <div className="space-y-2">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          return (
            <motion.button
              key={method.id}
              onClick={() => { setSelectedMethod(method.id); }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                isSelected
                  ? 'border-primary/60 bg-primary/10 text-white shadow-[0_0_20px_-8px_rgba(208,188,255,0.3)]'
                  : 'border-white/5 bg-surface-container-low/30 text-on-surface-variant hover:border-white/20 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${
                isSelected ? method.color : 'from-white/5 to-white/[0.02]'
              } transition-all duration-300`}>
                <Icon size={20} className={isSelected ? 'text-white' : 'text-on-surface-variant'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{method.label}</p>
                <p className="text-xs opacity-60 truncate">{method.description}</p>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0"
                >
                  <Check size={12} className="text-on-primary" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="p-5 space-y-4">
      {/* Amount input */}
      <div>
        <label className="text-xs text-on-surface-variant uppercase tracking-wider mb-2 block font-semibold">
          Monto a pagar
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold text-lg">$</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max={balance}
            value={amount}
            onChange={(e) => setAmount(Math.min(Number(e.target.value), balance))}
            className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-xl pl-9 pr-4 py-3.5 text-on-surface text-lg font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>
        {amount < balance && amount > 0 && (
          <p className="text-xs text-amber-400 mt-1.5">Pago parcial — Quedará un saldo de ${(balance - amount).toFixed(2)}</p>
        )}
      </div>

      {/* ─── TARJETA ─── */}
      {selectedMethod === 'Punto de Venta' && (
        <div className="space-y-3">
          <AnimatedCardPreview cardForm={cardForm} amount={amount} isFlipped={cardFlipped} />
          <input
            placeholder="Número de tarjeta"
            value={cardForm.number}
            onChange={(e) => {
              const val = formatCardNumber(e.target.value);
              setCardForm({ ...cardForm, number: val });
              validateCardField('number', val);
            }}
            onFocus={() => setCardFlipped(false)}
            className={`w-full bg-surface-container-highest/50 border ${getFieldClass('number')} rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all font-mono tracking-wider`}
            maxLength={19}
          />
          <div className="flex gap-3">
            <input
              placeholder="MM/AA"
              value={cardForm.expiry}
              onChange={(e) => {
                const val = formatExpiry(e.target.value);
                setCardForm({ ...cardForm, expiry: val });
                validateCardField('expiry', val);
              }}
              onFocus={() => setCardFlipped(false)}
              className={`flex-1 bg-surface-container-highest/50 border ${getFieldClass('expiry')} rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all font-mono`}
              maxLength={5}
            />
            <div className="relative flex-1">
              <input
                type={showCvc ? 'text' : 'password'}
                placeholder="CVC"
                value={cardForm.cvc}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setCardForm({ ...cardForm, cvc: val });
                  validateCardField('cvc', val);
                }}
                onFocus={() => setCardFlipped(true)}
                onBlur={() => setCardFlipped(false)}
                className={`w-full bg-surface-container-highest/50 border ${getFieldClass('cvc')} rounded-xl px-4 py-3 pr-10 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all font-mono`}
                maxLength={4}
              />
              <button
                onClick={() => setShowCvc(!showCvc)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
                type="button"
              >
                {showCvc ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <input
            placeholder="Nombre del titular"
            value={cardForm.name}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setCardForm({ ...cardForm, name: val });
              validateCardField('name', val);
            }}
            onFocus={() => setCardFlipped(false)}
            className={`w-full bg-surface-container-highest/50 border ${getFieldClass('name')} rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all`}
          />
        </div>
      )}

      {/* ─── TRANSFERENCIA ─── */}
      {selectedMethod === 'Transferencia' && (
        <div className="space-y-3">
          <div className="bg-surface-container-low/40 rounded-xl border border-white/5 p-4 space-y-3">
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Datos de la cuenta destino</p>
            {BANK_ACCOUNTS.map((acc, i) => (
              <div key={i} className="space-y-2 text-sm">
                {[
                  { label: 'Banco', value: acc.bank, copyKey: null },
                  { label: 'Tipo', value: acc.type, copyKey: null },
                  { label: 'N° Cuenta', value: acc.account, copyKey: 'account' },
                  { label: 'Titular', value: acc.holder, copyKey: null },
                  { label: 'RIF', value: acc.rif, copyKey: 'rif' },
                ].map(({ label, value, copyKey }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-on-surface-variant">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-white ${copyKey ? 'font-mono text-xs' : ''}`}>{value}</span>
                      {copyKey && (
                        <button onClick={() => copyToClipboard(value, copyKey)} className="text-primary hover:text-primary-fixed-dim transition-colors">
                          {copied === copyKey ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="bg-surface-container-low/40 rounded-xl border border-white/5 p-4 space-y-3">
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Tu información</p>

            <div>
              <label className="text-xs text-on-surface-variant mb-1.5 block">Banco de origen</label>
              <select
                value={senderBank}
                onChange={(e) => setSenderBank(e.target.value)}
                className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all appearance-none"
              >
                <option value="">Selecciona tu banco</option>
                {VENEZUELAN_BANKS.map((bank) => (
                  <option key={bank} value={bank} className="bg-surface-container-highest">{bank}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-on-surface-variant mb-1.5 block">N° de referencia / comprobante</label>
              <input
                type="text"
                placeholder="Ej: 1234567890"
                value={transferReference}
                onChange={(e) => setTransferReference(e.target.value.replace(/\D/g, '').slice(0, 20))}
                className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-mono"
              />
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <p className="text-xs text-amber-400 text-center">
              Transfiere el monto exacto de <strong>${Number(amount).toFixed(2)}</strong> y registra el número de referencia para que podamos verificar tu pago.
            </p>
          </div>
        </div>
      )}

      {/* ─── PAGO MÓVIL ─── */}
      {selectedMethod === 'Pago Móvil' && (
        <div className="space-y-3">
          <div className="bg-surface-container-low/40 rounded-xl border border-white/5 p-4 space-y-3">
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Datos del beneficiario</p>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Teléfono', value: PAGO_MOVIL_DATA.phone, copyKey: 'pm_phone' },
                { label: 'Banco', value: PAGO_MOVIL_DATA.bank, copyKey: null },
                { label: 'Cédula/RIF', value: PAGO_MOVIL_DATA.docId, copyKey: 'pm_doc' },
              ].map(({ label, value, copyKey }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-on-surface-variant">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-white ${copyKey ? 'font-mono text-xs' : 'font-semibold'}`}>{value}</span>
                    {copyKey && (
                      <button onClick={() => copyToClipboard(value, copyKey)} className="text-primary hover:text-primary-fixed-dim transition-colors">
                        {copied === copyKey ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low/40 rounded-xl border border-white/5 p-4 space-y-3">
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Tu información</p>

            <div>
              <label className="text-xs text-on-surface-variant mb-1.5 block">Tu banco</label>
              <select
                value={pmSenderBank}
                onChange={(e) => setPmSenderBank(e.target.value)}
                className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all appearance-none"
              >
                <option value="">Selecciona tu banco</option>
                {VENEZUELAN_BANKS.map((bank) => (
                  <option key={bank} value={bank} className="bg-surface-container-highest">{bank}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-on-surface-variant mb-1.5 block">Teléfono registrado en Pago Móvil</label>
              <input
                type="text"
                placeholder="Ej: 04121234567"
                value={pmSenderPhone}
                onChange={(e) => setPmSenderPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-on-surface-variant mb-1.5 block">N° de referencia / comprobante</label>
              <input
                type="text"
                placeholder="Ej: 1234567890"
                value={pmReference}
                onChange={(e) => setPmReference(e.target.value.replace(/\D/g, '').slice(0, 20))}
                className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-mono"
              />
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
            <p className="text-xs text-orange-400 text-center">
              Realiza el pago móvil por el monto exacto de <strong>${Number(amount).toFixed(2)}</strong> y registra tu referencia para verificar el pago.
            </p>
          </div>
        </div>
      )}

      {/* ─── ZELLE ─── */}
      {selectedMethod === 'Zelle' && (
        <div className="space-y-3">
          <div className="bg-surface-container-low/40 rounded-xl border border-white/5 p-4 space-y-3">
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Datos para Zelle</p>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Email', value: ZELLE_DATA.email, copyKey: 'zelle_email' },
                { label: 'Nombre', value: ZELLE_DATA.name, copyKey: null },
              ].map(({ label, value, copyKey }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-on-surface-variant">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-white ${copyKey ? 'font-mono text-xs' : 'font-semibold'}`}>{value}</span>
                    {copyKey && (
                      <button onClick={() => copyToClipboard(value, copyKey)} className="text-primary hover:text-primary-fixed-dim transition-colors">
                        {copied === copyKey ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low/40 rounded-xl border border-white/5 p-4 space-y-3">
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Confirma tu envío</p>
            <div>
              <label className="text-xs text-on-surface-variant mb-1.5 block">N° de referencia de Zelle</label>
              <input
                type="text"
                placeholder="Ej: ZELLE-12345"
                value={zelleReference}
                onChange={(e) => setZelleReference(e.target.value.slice(0, 30))}
                className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
            <p className="text-xs text-indigo-400 text-center">
              Envía <strong>${Number(amount).toFixed(2)} USD</strong> por Zelle a <strong>{ZELLE_DATA.email}</strong> e ingresa la referencia para verificar tu pago.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderConfirmStep = () => (
    <div className="p-5 space-y-4">
      <div className="bg-surface-container-low/40 rounded-xl border border-white/5 p-5 space-y-4">
        <div className="text-center mb-2">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${methodInfo?.color || 'from-primary to-primary'} flex items-center justify-center mx-auto mb-3`}>
            {methodInfo && <methodInfo.icon size={22} className="text-white" />}
          </div>
          <h4 className="font-playfair text-lg font-bold text-white">Confirma tu pago</h4>
          <p className="text-xs text-on-surface-variant mt-1">Revisa los detalles antes de continuar</p>
        </div>

        <div className="border-t border-white/5 pt-4 space-y-3 text-sm">
          {[
            { label: 'Referencia', value: `#${invoice?.reference || invoice?.sale_id}` },
            { label: 'Método', value: methodInfo?.label || selectedMethod },
            ...(selectedMethod === 'Transferencia' && transferReference ? [{ label: 'N° Transf.', value: transferReference }] : []),
            ...(selectedMethod === 'Pago Móvil' && pmReference ? [{ label: 'N° Pago Móvil', value: pmReference }] : []),
            ...(selectedMethod === 'Zelle' && zelleReference ? [{ label: 'Ref. Zelle', value: zelleReference }] : []),
            { label: 'Total del recibo', value: `$${total.toFixed(2)}` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-on-surface-variant">{label}</span>
              <span className="text-white font-semibold">{value}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2 border-t border-white/5">
            <span className="text-on-surface-variant font-semibold">Monto a pagar</span>
            <span className="text-xl font-bold text-primary">${Number(amount).toFixed(2)}</span>
          </div>
          {amount < balance && (
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-xs">Saldo restante</span>
              <span className="text-amber-400 text-xs">${(balance - amount).toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-start gap-2">
        <ShieldCheck size={16} className="text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-on-surface-variant">
          Esta es una <strong className="text-white">simulación de pago</strong>. El monto se registrará en tu cuenta y el equipo de La Casona lo verificará.
        </p>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="p-8 text-center">
      <div className="relative w-24 h-24 mx-auto mb-8">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-white/10" />
        {/* Spinning ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-[3px] border-t-primary border-r-transparent border-b-transparent border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        {/* Pulsing inner */}
        <motion.div
          className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {processingStep < PROCESSING_STEPS.length - 1 ? (
            <Loader2 size={28} className="text-primary animate-spin" style={{ animationDuration: '0.7s' }} />
          ) : (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
              <CheckCircle2 size={28} className="text-secondary" />
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="space-y-3 max-w-[260px] mx-auto">
        {PROCESSING_STEPS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i <= processingStep ? 1 : 0.25, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
              i < processingStep ? 'bg-secondary text-white' :
              i === processingStep ? 'bg-primary text-on-primary' :
              'bg-white/10 text-on-surface-variant'
            }`}>
              {i < processingStep ? <Check size={12} /> : (
                i === processingStep ? (
                  <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                    {i + 1}
                  </motion.span>
                ) : i + 1
              )}
            </div>
            <p className={`text-sm text-left ${i <= processingStep ? 'text-white' : 'text-on-surface-variant'}`}>
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderResultStep = () => {
    if (result?.success) {
      return (
        <div className="p-6 relative overflow-hidden">
          <ConfettiCanvas />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, delay: 0.15 }}
            className="relative z-10"
          >
            <div className="bg-surface-container-low/40 rounded-xl border border-secondary/20 p-5">
              <div className="text-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                  className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3"
                >
                  <CheckCircle2 className="text-secondary w-8 h-8" />
                </motion.div>
                <h4 className="font-playfair text-xl font-bold text-white">¡Pago Exitoso!</h4>
                <p className="text-xs text-on-surface-variant mt-1">Tu pago ha sido registrado correctamente</p>
              </div>

              <div className="border-t border-white/5 pt-4 space-y-2 text-sm">
                {[
                  { label: 'Transacción', value: result.transaction_id, mono: true },
                  { label: 'Método', value: result.transaction?.method || selectedMethod },
                  { label: 'Monto', value: `$${Number(amount).toFixed(2)}`, bold: true },
                  { label: 'Fecha', value: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                  { label: 'Referencia', value: `#${invoice?.reference || invoice?.sale_id}` },
                ].map(({ label, value, mono, bold }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-on-surface-variant">{label}</span>
                    <span className={`text-white ${mono ? 'font-mono text-xs' : ''} ${bold ? 'font-bold' : ''}`}>{value}</span>
                  </div>
                ))}
              </div>

              {result.invoice?.balance > 0 && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
                  <p className="text-xs text-amber-400">Saldo pendiente: ${Number(result.invoice.balance).toFixed(2)}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                <button
                  onClick={() => downloadReceipt(result, invoice, amount, selectedMethod)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all border border-white/5"
                >
                  <Download size={14} />
                  Descargar Recibo
                </button>
                <button
                  onClick={shareByWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold transition-all border border-emerald-600/20"
                >
                  <Share2 size={14} />
                  Compartir
                </button>
              </div>

              {/* Countdown */}
              <div className="mt-4 text-center">
                <p className="text-[10px] text-on-surface-variant">
                  Se cerrará automáticamente en {countdown}s
                </p>
                <div className="mt-1.5 w-full bg-white/5 rounded-full h-1 overflow-hidden">
                  <motion.div
                    className="h-full bg-secondary rounded-full"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 6, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    // Error
    return (
      <div className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <AlertCircle className="text-error w-8 h-8" />
        </motion.div>
        <h4 className="font-playfair text-xl font-bold text-white mb-2">Error en el pago</h4>
        <p className="text-sm text-on-surface-variant mb-6">{result?.message || 'Ocurrió un error inesperado'}</p>
        <Button variant="outline" onClick={resetToStart}>Reintentar</Button>
      </div>
    );
  };

  /* ─────────────────── MAIN RENDER ─────────────────── */

  const getHeaderTitle = () => {
    if (result?.success) return '¡Pago Realizado!';
    if (result && !result.success) return 'Error';
    switch (step) {
      case 'method': return 'Método de Pago';
      case 'details': return 'Detalles del Pago';
      case 'confirm': return 'Confirmar Pago';
      case 'processing': return 'Procesando...';
      default: return 'Pagar Recibo';
    }
  };

  const isProcessingOrResult = stepIndex >= 3;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget && !isProcessingOrResult) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md bg-surface-container border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 pb-2 shrink-0">
            <div className="flex items-center gap-2">
              {stepIndex > 0 && stepIndex < 3 && (
                <button onClick={goBack} className="text-on-surface-variant hover:text-white transition-colors mr-1">
                  <ChevronLeft size={20} />
                </button>
              )}
              <h3 className="font-playfair text-lg font-bold text-white">{getHeaderTitle()}</h3>
            </div>
            {!isProcessingOrResult && (
              <button onClick={onClose} className="text-on-surface-variant hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
                <X size={18} />
              </button>
            )}
          </div>

          {/* Stepper (only show for first 3 steps) */}
          {stepIndex < 3 && <Stepper currentIndex={stepIndex} />}

          {/* Invoice summary (only on method and details) */}
          {stepIndex < 2 && (
            <div className="mx-5 mt-2 p-3.5 bg-surface-container-low/40 rounded-xl border border-white/5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Ref: #{invoice?.reference || invoice?.sale_id}</span>
                <span className="font-bold text-white">${total.toFixed(2)}</span>
              </div>
              {balance < total && (
                <div className="flex justify-between items-center mt-1 pt-1.5 border-t border-white/5 text-xs">
                  <span className="text-on-surface-variant">Saldo pendiente</span>
                  <span className="font-semibold text-amber-400">${balance.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          {/* Step Content */}
          <div className="overflow-y-auto flex-1 relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                {step === 'method' && renderMethodStep()}
                {step === 'details' && renderDetailsStep()}
                {step === 'confirm' && renderConfirmStep()}
                {step === 'processing' && renderProcessingStep()}
                {step === 'result' && renderResultStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Buttons */}
          {stepIndex < 3 && (
            <div className="p-5 pt-3 border-t border-white/5 shrink-0">
              {stepIndex === 0 && (
                <Button
                  variant="primary"
                  onClick={goNext}
                  disabled={!selectedMethod}
                  className="w-full justify-center"
                >
                  Continuar
                  <ArrowRight size={16} />
                </Button>
              )}
              {stepIndex === 1 && (
                <Button
                  variant="primary"
                  onClick={goNext}
                  disabled={!canProceedFromDetails}
                  className="w-full justify-center"
                >
                  Revisar y Confirmar
                  <ArrowRight size={16} />
                </Button>
              )}
              {stepIndex === 2 && (
                <Button
                  variant="primary"
                  onClick={handlePay}
                  className="w-full justify-center"
                >
                  <ShieldCheck size={16} />
                  Confirmar Pago — ${Number(amount).toFixed(2)}
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
