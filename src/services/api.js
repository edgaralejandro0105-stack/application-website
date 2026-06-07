const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Función genérica para manejar peticiones fetch.
 */
async function fetchAPI(endpoint, options = {}) {
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Fetch error on ${endpoint}:`, error);
    throw error;
  }
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


