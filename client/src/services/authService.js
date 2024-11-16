import axiosInstance from './axiosInstance';

// Funzione per il signup
export const signup = async (userData) => {
  try {
    const response = await axiosInstance.post('auth/signup', userData);
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Errore durante la registrazione');
  }
};

// Funzione per il login
export const login = async (userData) => {
  try {
    const response = await axiosInstance.post('auth/login', userData);
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Errore durante il login');
  }
};

// Funzione per richiedere il reset della password
export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post('auth/forgot-password', { email });
    return response.data; // Risultato del backend
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Errore durante il recupero della password');
  }
};

// Funzione per resettare la password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axiosInstance.post(`auth/reset-password/${token}`, {
      password: newPassword,
    });
    return response.data; // Risultato del backend
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Errore durante il reset della password');
  }
};
