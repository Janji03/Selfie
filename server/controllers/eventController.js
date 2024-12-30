import Event from "../models/Event.js";
import scheduleEventNotifications from "../scheduler/eventNotificationScheduler.js";

// Estrai tutti gli eventi
export const getEvents = async (req, res) => {
  const { userID } = req.query;
  try {
    const events = await Event.find({ userID });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero degli eventi" });
  }
};

// Estrai un evento tramite il suo ID
export const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findOne({ id });

    if (!event) {
      return res.status(404).json({ error: "Evento non trovato" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Errore nel recupero dell'evento:", error);
    res.status(500).json({ error: "Errore durante il recupero dell'evento" });
  }
};

// Crea un evento
export const createEvent = async (req, res) => {
  const { eventData, userID } = req.body;

  try {
    const newEvent = new Event({
      ...eventData,
      userID,
    });

    const savedEvent = await newEvent.save();

    await scheduleEventNotifications(newEvent.id);

    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ error: "Errore nella creazione dell'evento" });
  }
};

// Aggiorna un evento
export const updateEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedEvent = await Event.findOneAndUpdate({ id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ error: "Evento non trovato" });
    }

    await scheduleEventNotifications(updatedEvent.id);

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiornamento dell'evento" });
  }
};

// Cancella un evento
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findOneAndDelete({ id });

    if (!deletedEvent) {
      return res.status(404).json({ error: "Evento non trovato" });
    }

    res.status(200).json({ message: "Evento eliminato con successo" });
  } catch (error) {
    res.status(500).json({ error: "Errore nell'eliminazione dell'evento" });
  }
};

