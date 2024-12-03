import axiosInstance from "./axiosInstance";

// creare un nuovo Pomodoro
export const createPomodoro = async (pomodoroData) => {
  try {
    const res = await axiosInstance.post('/pomodoro', pomodoroData);
    return res.data;
  } catch (error) {
    console.error('Errore nella creazione del Pomodoro:', error);
    throw error;
  }
};

//ottenere Pomodori precedenti
export const getUserPomodoros = async (nPomodoro, userID) => {
  try {
    const res = await axiosInstance.get('/pomodoro', {
      params: { 
        limit: nPomodoro, 
        userID: userID
      }
    });
    return res.data;
  } catch (error) {
    console.error('Errore nel recupero dei Pomodori precedenti:', error);
    throw error;
  }
};
