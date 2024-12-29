import React, { useState } from "react";
import { deleteNote, duplicateNote } from "../../services/noteService";
import markdownIcon from "../../assets/markdownIcon.png";

const NotesView = ({ notes, setSelectedNote, refreshNotes }) => {
  const userID = localStorage.getItem("userID"); // Ottieni l'ID dell'utente corrente
  const [visibilityFilter, setVisibilityFilter] = useState("all"); // Stato per il filtro della visibilità

  // Funzione per eliminare una nota
  const handleDelete = (noteID) => {
    deleteNote(noteID)
      .then(() => {
        refreshNotes(); // Aggiorna la lista delle note
        setSelectedNote((current) => (current?._id === noteID ? null : current)); // Deseleziona la nota se eliminata
      })
      .catch(console.error);
  };

  // Funzione per duplicare una nota
  const handleDuplicate = (noteID) => {
    duplicateNote(noteID, userID)
      .then(() => {
        refreshNotes(); // Aggiorna la lista delle note
      })
      .catch(console.error);
  };

  // Controlla se il contenuto contiene sintassi Markdown
  const isMarkdown = (content) => {
    return /[#*_~`-]/.test(content);
  };

  // Funzione per filtrare le note in base alla visibilità selezionata
  const filterNotesByVisibility = (note) => {
    if (visibilityFilter === "all") return true; // Mostra tutte le note
    if (visibilityFilter === "public" && note.visibility === "open") return true; // Mostra solo le note pubbliche
    if (visibilityFilter === "restricted" && note.visibility === "restricted") return true; // Mostra solo le note ristrette
    if (visibilityFilter === "private" && note.userID === userID && note.visibility === "private") return true; // Mostra solo le note private dell'utente
    return false;
  };

  return (
    <div className="notes-list">
      
      {/* Dropdown per scegliere il filtro di visibilità */}
      <div className="visibility-filter">
        <label>Filtra per visibilità: </label>
        <select
          value={visibilityFilter}
          onChange={(e) => setVisibilityFilter(e.target.value)}
        >
          <option value="all">Tutte</option>
          <option value="public">Pubbliche</option>
          <option value="restricted">Ristrette</option>
          <option value="private">Private (miei)</option>
        </select>
      </div>

      {notes.filter(filterNotesByVisibility).map((note) => (
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

            {/* Mostra i pulsanti Duplica ed Elimina solo se l'utente è il proprietario */}
            {note.userID === userID && (
              <>
                <button
                  className="note-button"
                  onClick={() => handleDelete(note._id)}
                >
                  Elimina
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesView;
