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

/* entrambe le funzioni restituiscono il token e lo userID (response.data)   */

// Funzione per la richiesta di reset password
export const forgotPassword = async (userData) => {
  try {
    const response = await axiosInstance.post('auth/forgot-password', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Errore durante la richiesta di reset');
  }
};

// Funzione per il reset della password
export const resetPassword = async (data) => {
  try {
    const response = await axiosInstance.post('auth/reset-password', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Errore durante il reset della password');
  }
};
