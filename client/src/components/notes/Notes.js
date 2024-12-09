import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { createNote, getNotes } from "../../services/noteService";
import NotesView from "./NotesView";
import NotesDetail from "./NotesDetail";
import SortNotes from "./SortNotes";
import '../../styles/Notes.css';

const Notes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const userID = localStorage.getItem("userID");
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    categories: [],
  });

  useEffect(() => {
    if (isAuthenticated) {
      getNotes(userID)
        .then((data) => setNotes(data))
        .catch((err) => setError(err.message));
    }
  }, [isAuthenticated, userID]);

  const handleCreateNote = (e) => {
    e.preventDefault();

    if (!newNote.title || !newNote.categories.length) {
      setError("Titolo e categorie sono obbligatori");
      return;
    }

    if (!newNote.content.trim()) {
      setError("Il contenuto non può essere vuoto");
      return;
    }

    createNote({ ...newNote, userID })
      .then((createdNote) => {
        setNotes((prev) => [...prev, createdNote]);
        setNewNote({ title: "", content: "", categories: [] });
        setError(null);
        setIsCreating(false);
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="notes-container">
      <button
        className="new-note-button"
        onClick={() => setIsCreating(true)}
      >
        Nuova Nota
      </button>

      {isCreating && (
        <div className="new-note-card">
          <h2>Nuova Nota</h2>
          <form onSubmit={handleCreateNote}>
            <input
              type="text"
              placeholder="Titolo"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Contenuto"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Categorie (separate da virgola)"
              value={newNote.categories.join(", ")}
              onChange={(e) =>
                setNewNote({ ...newNote, categories: e.target.value.split(",") })
              }
              required
            />
            <button className="create-note-button" type="submit">
              Crea Nota
            </button>
            <button className="create-note-button" onClick={()=>setIsCreating(false)}>
              Annulla
            </button>
          </form>
        </div>
      )}

      <NotesDetail
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        refreshNotes={() => getNotes(userID).then(setNotes)}
      />
      <SortNotes notes={notes} setNotes={setNotes} />
      <NotesView
        notes={notes}
        setSelectedNote={setSelectedNote}
        refreshNotes={() => getNotes(userID).then(setNotes)}
      />
    </div>
  );
};

export default Notes;
