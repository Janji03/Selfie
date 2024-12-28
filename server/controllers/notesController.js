import Note from "../models/Note.js";

// crea una nota
export const createNote = async (req, res) => {
  const { title, content, categories, userID, visibility, accessList } = req.body;

  if (!title || !categories || categories.length === 0) {
    return res
      .status(400)
      .json({ error: "Titolo e categorie sono obbligatori" });
  }

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Il contenuto non può essere vuoto" });
  }

  // Validazione per visibility
  if (visibility && !['open', 'restricted', 'private'].includes(visibility)) {
    return res.status(400).json({ error: "Visibilità non valida" });
  }

  // Se la visibilità è 'restricted', controlla che accessList sia presente
  if (visibility === 'restricted' && (!accessList || accessList.length === 0)) {
    return res.status(400).json({ error: "La lista di accesso è obbligatoria per visibilità 'restricted'" });
  }

  try {
    const newNote = new Note({
      title,
      content,
      categories,
      userID,
      visibility: visibility || 'open', // Impostazione della visibilità predefinita su 'open'
      accessList: accessList || [], // Impostazione di accessList vuota per visibilità predefinita
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ error: "Errore nella creazione della nota" });
  }
};


// Ottieni tutte le note
export const getNotes = async (req, res) => {
  const { userID } = req.query;

  try {
    // Trova tutte le note pubbliche, tutte le note private dell'utente e tutte le note "restricted" a cui l'utente ha accesso
    const notes = await Note.find({
      $or: [
        { visibility: 'open' }, // Note pubbliche
        { userID }, // Le note dell'utente
        { visibility: 'restricted', accessList: userID }, // Le note a cui l'utente ha accesso
      ],
    });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero delle note" });
  }
};

// modifica una nota
export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, categories, visibility, accessList } = req.body;
  const { userID } = req.query;

  console.log("Received data:", { title, content, categories, visibility, accessList }); // Aggiungi il log qui

  if (!title || !categories || categories.length === 0) {
    return res.status(400).json({ error: "Titolo e categorie sono obbligatori" });
  }

  try {
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ error: "Nota non trovata" });
    }


    // Modifica il contenuto e altre informazioni, ma solo se l'utente è il proprietario
    note.title = title;
    note.content = content;
    note.categories = categories;

    // Solo il proprietario può modificare la visibilità
    
      if (visibility) note.visibility = visibility; // Modifica la visibilità
      if (accessList) note.accessList = accessList; // Modifica l'accesso
    

    const updatedNote = await note.save(); // Salva la nota aggiornata
    res.status(200).json(updatedNote);

  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiornamento della nota" });
  }
};


// Cancella una nota
export const deleteNote = async (req, res) => {
  const { id } = req.params;
  const { userID } = req.query;  // Ottieni l'ID dell'utente che sta facendo la richiesta

  try {
    // Trova la nota
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ error: "Nota non trovata" });
    }

    // Verifica che l'utente sia l'autore della nota o abbia accesso alla nota "restricted"
    if (note.userID.toString() !== userID && (note.visibility === 'restricted' && !note.accessList.includes(userID))) {
      return res.status(403).json({ error: "Non hai i permessi per eliminare questa nota" });
    }

    // Elimina la nota
    await Note.findByIdAndDelete(id);

    res.status(200).json({ message: "Nota eliminata con successo" });
  } catch (error) {
    res.status(500).json({ error: "Errore nell'eliminazione della nota" });
  }
};


// Duplica una nota
export const duplicateNote = async (req, res) => {
  const { id } = req.params;
  const { userID } = req.query;  // Ottieni l'ID dell'utente che sta facendo la richiesta

  try {
    // Trova la nota originale
    const originalNote = await Note.findById(id);

    if (!originalNote) {
      return res.status(404).json({ error: "Nota originale non trovata" });
    }

    // Verifica che l'utente sia l'autore della nota o abbia accesso alla nota "restricted"
    if (originalNote.userID.toString() !== userID && (originalNote.visibility === 'restricted' && !originalNote.accessList.includes(userID))) {
      return res.status(403).json({ error: "Non hai i permessi per duplicare questa nota" });
    }

    // Crea la nota duplicata
    const duplicatedNote = new Note({
      title: `Copia di ${originalNote.title}`,
      content: originalNote.content,
      categories: originalNote.categories,
      userID: originalNote.userID,
      visibility: originalNote.visibility,  // Mantieni la visibilità originale
      accessList: originalNote.accessList,  // Mantieni la lista di accesso originale
    });

    // Salva la nota duplicata
    const savedDuplicate = await duplicatedNote.save();
    res.status(201).json(savedDuplicate);
  } catch (error) {
    res.status(500).json({ error: "Errore nella duplicazione della nota" });
  }
};
