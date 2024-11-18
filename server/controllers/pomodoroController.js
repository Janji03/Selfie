// controllers/pomodoroController.js
import Pomodoro from '../models/Pomodoro.js';

// Funzione per creare un nuovo Pomodoro
export const createPomodoro = async (req, res) => {
  try {
    const { studyTime, breakTime, cycles } = req.body;
    const newPomodoro = new Pomodoro({ studyTime, breakTime, cycles });
    await newPomodoro.save();
    res.status(201).json(newPomodoro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};