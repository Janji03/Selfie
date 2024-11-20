import React, { useState } from "react";
import { updateNote } from "../../services/noteService";

const NotesDetail = ({ note, onClose, refreshNotes }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(note?.content || ""); // Usa un valore iniziale sicuro

  const handleSave = () => {
    if (!note) return;
    updateNote(note._id, { ...note, content: editedContent })
      .then(() => {
        refreshNotes();
        setEditMode(false);
      })
      .catch(console.error);
  };

  if (!note) return null; // Se non c'è una nota, non mostriamo nulla

  return (
    <div>
      <h2>{note.title}</h2>
      {editMode ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
      ) : (
        <p>{note.content}</p>
      )}
      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? "Annulla" : "Modifica"}
      </button>
      {editMode && <button onClick={handleSave}>Salva</button>}
      <button onClick={onClose}>Chiudi</button>
    </div>
  );
};

export default NotesDetail;
