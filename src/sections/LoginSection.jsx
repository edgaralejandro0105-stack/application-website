import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/Button';
import { useClientAuth } from '../context/ClientAuthContext';

export function LoginSection() {
  const navigate = useNavigate();
  const { login } = useClientAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://api-lacasona.onrender.com/api';
      const response = await fetch(`${apiUrl}/client-portal/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Success
      login(data.client, data.token);
      setIsLoading(false);
      navigate('/portal');
    } catch (err) {
      setError(err.message || 'Error de conexión. Intenta nuevamente.');
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      key="login-form" 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: 20 }} 
      transition={{ duration: 0.3 }} 
      className="flex flex-col max-w-md mx-auto py-4"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30 shadow-[0_0_15px_rgba(208,188,255,0.2)]">
          <LogIn className="text-primary w-8 h-8 ml-1" />
        </div>
        <h3 className="font-playfair text-2xl font-bold text-white mb-2">Portal del Cliente</h3>
        <p className="text-sm font-jakarta text-on-surface-variant">
          Ingresa con tu correo y tu clave temporal (Inicial de tu nombre en mayúscula + Documento de identidad).
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleLogin}>
        <div className="flex flex-col gap-2">
          <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Correo Electrónico</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com" 
            className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md px-4 py-3 text-on-surface focus:outline-none focus:border-primary placeholder:text-outline-variant transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2 relative">
          <label className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">Contraseña</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ej: J12345678" 
              className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-md pl-4 pr-12 py-3 text-on-surface focus:outline-none focus:border-primary placeholder:text-outline-variant transition-colors"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="bg-error/10 border border-error/30 rounded-md p-3 flex items-start gap-3 mt-2 overflow-hidden"
            >
              <AlertCircle className="text-error shrink-0 w-5 h-5 mt-0.5" />
              <p className="text-xs text-error font-jakarta leading-relaxed">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <Button variant="primary" type="submit" className="w-full mt-4 h-[46px] justify-center" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
              Validando...
            </div>
          ) : 'Ingresar al Portal'}
        </Button>
      </form>
    </motion.div>
  );
}
