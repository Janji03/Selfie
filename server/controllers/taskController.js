import Task from "../models/Task.js";
import agenda from "../config/agenda.js";
import scheduleTaskNotifications from "../scheduler/taskNotificationScheduler.js";

// Estrai tutti le task
export const getTasks = async (req, res) => {
  const { userID } = req.query;
  try {
    const tasks = await Task.find({ userID, "extendedProps.temporary": false });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero delle task" });
  }
};

// Estrai una task tramite il suo ID
export const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ id });

    if (!task) {
      return res.status(404).json({ error: "Task non trovata" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Errore nel recupero della task:", error);
    res.status(500).json({ error: "Errore durante il recupero della task" });
  }
};

// Crea una task
export const createTask = async (req, res) => {
  const { taskData, userID } = req.body;
  try {
    const newTask = new Task({
      ...taskData,
      userID,
    });

    const savedTask = await newTask.save();

    if (!savedTask.extendedProps.temporary) {
      await scheduleTaskNotifications(agenda, userID, savedTask);
    }

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ error: "Errore nella creazione della task" });
  }
};

// Aggiorna una task
export const updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTask = await Task.findOneAndUpdate({ id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ error: "Task non trovata" });
    }
    
    await agenda.cancel({
      "data.task.id": id,
      "data.task.userID": updatedTask.userID,
    });    
    await scheduleTaskNotifications(agenda, updatedTask.userID, updatedTask);
    
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiornamento della task" });
  }
};

// Cancella una task
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findOneAndDelete({ id });

    if (!deletedTask) {
      return res.status(404).json({ error: "Task non trovata" });
    }

    await agenda.cancel({
      "data.task.id": id,
      "data.task.userID": deletedTask.userID,
    }); 

    res.status(200).json({ message: "Task eliminata con successo" });
  } catch (error) {
    res.status(500).json({ error: "Errore nell'eliminazione della task" });
  }
};
