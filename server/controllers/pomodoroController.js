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


 export const getPreviousPomodoros = async (req, res) => {
  try {
    //traduce limit in intero
    const limit = parseInt(req.query.limit, 10);

    //pomdodoros contiene i risultati dellaa query
    const pomodoros = limit       //.find query su Pomodoro, .sort({ date: -1 }) filtra in base a date in ordine decresecente
      ? await Pomodoro.find().sort({ date: -1 }).limit(limit) // n pomodori
      : await Pomodoro.find().sort({ date: -1 }); // tutti i pomodori

    res.status(200).json(pomodoros);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero dei pomodori', error: error.message });
  }
};
