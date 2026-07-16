import { useState } from 'react';

export function usePayment() {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const simulatePayment = async (saleId, amount, method, token, extra = {}) => {
    setProcessing(true);
    setResult(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://api-lacasona.onrender.com/api';
      const response = await fetch(`${apiUrl}/client-portal/payments/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sale_id: saleId,
          amount,
          payment_method: method,
          ...extra,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al procesar el pago');
      }

      setResult(data);
      return data;
    } catch (err) {
      const errorData = { success: false, message: err.message };
      setResult(errorData);
      return errorData;
    } finally {
      setProcessing(false);
    }
  };

  const resetResult = () => setResult(null);

  return { simulatePayment, processing, result, resetResult };
}
