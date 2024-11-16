import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/', // URL del tuo backend
  headers: {
    'Content-Type': 'application/json', // Tipo di contenuto
  },
});

export default axiosInstance;
