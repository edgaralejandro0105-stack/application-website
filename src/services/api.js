const API_URL = import.meta.env.VITE_API_URL || 'https://api-lacasona.onrender.com/api';

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Función genérica para manejar peticiones fetch con caché.
 */
async function fetchAPI(endpoint, options = {}) {
  const method = options.method || 'GET';
  const cacheKey = endpoint;

  if (method === 'GET' && cache.has(cacheKey)) {
    const cachedEntry = cache.get(cacheKey);
    const isExpired = Date.now() - cachedEntry.timestamp > CACHE_DURATION;
    
    if (!isExpired) {
      return cachedEntry.promise;
    }
  }

  const promise = (async () => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Fetch error on ${endpoint}:`, error);
      cache.delete(cacheKey); // Limpiar caché si hay error
      throw error;
    }
  })();

  if (method === 'GET') {
    cache.set(cacheKey, { promise, timestamp: Date.now() });
  }

  return promise;
}

export const getProducts = async (limit) => {
  const url = limit ? `/products?limit=${limit}` : '/products';
  return fetchAPI(url);
};

export const getEvents = async () => {
  return fetchAPI('/events');
};

export const getVenues = async () => {
  return fetchAPI('/venues');
};

export const getServices = async () => {
  return fetchAPI('/service-external');
};

export const getEmployees = async () => {
  return fetchAPI('/employees');
};

// ─── Client Portal ─────────────────────────────────────────────────────────────

export const clientPortalLogin = async (email, password) => {
  const response = await fetch(`${API_URL}/client-portal/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Error al iniciar sesión');
  }
  return response.json();
};

export const getMyInvoices = async (token) => {
  return fetchAPI('/client-portal/my-invoices', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const getMyEvents = async (token) => {
  return fetchAPI('/client-portal/my-events', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const getInvoicePayments = async (saleId, token) => {
  return fetchAPI(`/client-portal/my-invoices/${saleId}/payments`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const updateMilestone = async (eventId, milestoneId, status, token) => {
  const response = await fetch(`${API_URL}/client-portal/my-events/${eventId}/milestones/${milestoneId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Error al actualizar el hito');
  }
  return response.json();
};

export const simulatePayment = async ({ saleId, amount, paymentMethod, token, ...extra }) => {
  const response = await fetch(`${API_URL}/client-portal/payments/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ sale_id: saleId, amount, payment_method: paymentMethod, ...extra }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Error al procesar el pago');
  }
  return response.json();
};


