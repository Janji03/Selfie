import React from "react";
import { deleteNote, duplicateNote } from "../../services/noteService";
import markdownIcon from "../../assets/markdownIcon.png"; 

const NotesView = ({ notes, setSelectedNote, refreshNotes }) => {
  const userID = localStorage.getItem("userID");

  const handleDelete = (id) => {
    deleteNote(id)
      .then(() => {
        refreshNotes();
        setSelectedNote((current) => (current?._id === id ? null : current));
      })
      .catch(console.error);
  };

  const handleDuplicate = (id) => {
    duplicateNote(id).then(refreshNotes).catch(console.error);
  };

  const isMarkdown = (content) => {
    // Controlla se contiene sintassi Markdown comune
    return /[#*_~`-]/.test(content);
  };

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <div key={note._id} className="note-card">
          <div className="note-header">
            <h3>{note.title}</h3>
            {isMarkdown(note.content) && (
              <img
                src={markdownIcon}
                alt="Markdown icon"
                className="markdown-icon"
              />
            )}
          </div>
          <p>Categoria: {note.categories.join(", ")}</p>
          <p>{note.content.slice(0, 200)}...</p>
          <p>Visibilità: {note.visibility}</p> {/* Mostra la visibilità della nota */}
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
            {/* Mostra il pulsante Elimina solo se l'utente è il proprietario */}
            {note.userID === userID && (
              <button
                className="note-button"
                onClick={() => handleDelete(note._id)}
              >
                Elimina
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesView;
