import Note from '../models/Note.js';

// Crea una nuova nota con validazioni per title e categories
export const createNote = async (req, res) => {
  const { title, content, categories, userID } = req.body;

  if (!title || !categories || categories.length === 0) {
    return res.status(400).json({ error: 'Titolo e categorie sono obbligatori' });
  }

  try {
    const newNote = new Note({
      title,
      content,
      categories,
      userID,
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ error: 'Errore nella creazione della nota' });
  }
};


// Ottieni tutte le note
export const getNotes = async (req, res) => {
  const { userID } = req.query; // userID fornito dal frontend tramite query params

  try {
    const notes = await Note.find({ userID });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero delle note' });
  }
};

// Aggiorna una nota esistente, includendo titolo, contenuto e categorie
export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, categories } = req.body;

  if (!title || !categories || categories.length === 0) {
    return res.status(400).json({ error: 'Titolo e categorie sono obbligatori' });
  }

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content, categories },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: 'Nota non trovata' });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: 'Errore nell\'aggiornamento della nota' });
  }
};


// Cancella una nota
export const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ error: 'Nota non trovata' });
    }

    res.status(200).json({ message: 'Nota eliminata con successo' });
  } catch (error) {
    res.status(500).json({ error: 'Errore nell\'eliminazione della nota' });
  }
};

// Duplica una nota
export const duplicateNote = async (req, res) => {
  const { id } = req.params;

  try {
    // Trova la nota originale per ID
    const originalNote = await Note.findById(id);

    if (!originalNote) {
      return res.status(404).json({ error: 'Nota originale non trovata' });
    }

    // Crea la nota duplicata
    const duplicatedNote = new Note({
      title: `Copia di ${originalNote.title}`,
      content: originalNote.content,
      categories: originalNote.categories,
      userID: originalNote.userID,
    });

    // Salva la nota duplicata nel DB
    const savedDuplicate = await duplicatedNote.save();
    res.status(201).json(savedDuplicate);
  } catch (error) {
    res.status(500).json({ error: 'Errore nella duplicazione della nota' });
  }
};
