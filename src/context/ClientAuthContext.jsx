import React, { createContext, useState, useContext, useEffect } from 'react';

const ClientAuthContext = createContext(null);

export const ClientAuthProvider = ({ children }) => {
  const [client, setClient] = useState(() => {
    const saved = localStorage.getItem('casona_client_data');
    if (saved) return JSON.parse(saved);
    return null;
  });
  
  const [token, setToken] = useState(() => localStorage.getItem('casona_client_token'));

  const login = (clientData, authToken) => {
    setClient(clientData);
    setToken(authToken);
    localStorage.setItem('casona_client_data', JSON.stringify(clientData));
    localStorage.setItem('casona_client_token', authToken);
  };

  const logout = () => {
    setClient(null);
    setToken(null);
    localStorage.removeItem('casona_client_data');
    localStorage.removeItem('casona_client_token');
  };

  return (
    <ClientAuthContext.Provider value={{ client, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </ClientAuthContext.Provider>
  );
};

export const useClientAuth = () => useContext(ClientAuthContext);
