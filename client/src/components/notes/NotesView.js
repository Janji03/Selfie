import React from "react";
import { deleteNote, duplicateNote } from "../../services/noteService";

const NotesView = ({ notes, setSelectedNote, refreshNotes }) => {
  const handleDelete = (id) => {
    deleteNote(id).then(refreshNotes).catch(console.error);
  };

  const handleDuplicate = (id) => {
    duplicateNote(id).then(refreshNotes).catch(console.error);
  };

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <div key={note._id} className="note-card">
          <h3>{note.title}</h3>
          <p>Categoria: {note.categories.join(", ")}</p>
          <p>{note.content.slice(0, 200)}...</p>
          <div className="note-actions">
            <button
              className="note-button"
              onClick={() => setSelectedNote(note)}
            >
              Apri
            </button>
            <button
              className="note-button"
              onClick={() => handleDuplicate(note._id)}
            >
              Duplica
            </button>
            <button
              className="note-button"
              onClick={() => handleDelete(note._id)}
            >
              Elimina
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesView;
