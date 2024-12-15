import Pomodoro from "../models/Pomodoro.js";

// Funzione per creare un nuovo Pomodoro
export const createPomodoro = async (req, res) => {
  const { studyTime, breakTime, cycles, userID } = req.body;
  
  if (!studyTime || !breakTime || !cycles || !userID) {
    console.log('here 3');
    return res.status(400).json({ message: "Tutti i campi sono obbligatori." });
  }

  try {
    const newPomodoro = new Pomodoro({ studyTime, breakTime, cycles, userID });
    await newPomodoro.save();
    res.status(201).json(newPomodoro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPomodoros = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10);
    const userID = req.query.userID;

    if (!userID) {
      return res.status(400).json({ message: "userID è richiesto." });
    }

    const pomodoros = limit
      ? await Pomodoro.find({ userID }).limit(limit)
      : await Pomodoro.find({ userID });

    res.status(200).json(pomodoros);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Errore nel recupero dei pomodori",
        error: error.message,
      });
  }
};
