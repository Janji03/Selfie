import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica se il token è presente nel localStorage ogni volta che il componente viene montato o aggiornato
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Se il token esiste, l'utente è autenticato
  }, []);

  if (!isAuthenticated) {
    // Se non è autenticato, reindirizza alla pagina di login
    return <Navigate to="/login" />;
  }

  // Se l'utente è autenticato, mostra la pagina richiesta
  return children;
};

export default ProtectedRoute;
