const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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


