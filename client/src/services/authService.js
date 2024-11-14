// authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // URL del backend

// Funzione per il signup
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data; // Restituisce i dati, incluso il token
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Errore durante la registrazione');
  }
};

// Funzione per il login
export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data; // Restituisce i dati, incluso il token
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Errore durante il login');
  }
};
