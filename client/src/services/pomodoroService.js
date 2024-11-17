// services/pomodoroServices.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/pomodoro'; 

// Funzione per creare un nuovo Pomodoro
export const createPomodoro = async (pomodoroData) => {
  const res = await axios.post(API_URL, pomodoroData);
  return res.data;
};