import React, { useState, useEffect } from "react";
import { updateNote } from "../../services/noteService";

const NotesDetail = ({ note, onClose, refreshNotes }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(note?.content || "");
  const [editedTitle, setEditedTitle] = useState(note?.title || "");
  const [editedCategories, setEditedCategories] = useState(note?.categories.join(", ") || "");

  // Sync the note data when it changes
  useEffect(() => {
    if (note) {
      setEditedTitle(note.title);
      setEditedContent(note.content);
      setEditedCategories(note.categories.join(", "));
    }
  }, [note]);

  const handleSave = () => {
    if (!note) return;
    updateNote(note._id, {
      title: editedTitle,
      content: editedContent,
      categories: editedCategories.split(",").map((cat) => cat.trim()),
    })
      .then(() => {
        refreshNotes();
        setEditMode(false);
        onClose(); // Chiude automaticamente dopo il salvataggio
      })
      .catch(console.error);
  };

  if (!note) return null; // Se non c'è una nota, non mostriamo nulla

  return (
    <div>
      {editMode ? (
        <div>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Modifica Titolo"
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Modifica Contenuto"
          />
          <input
            type="text"
            value={editedCategories}
            onChange={(e) => setEditedCategories(e.target.value)}
            placeholder="Modifica Categorie (separate da virgola)"
          />
          <button onClick={handleSave}>Salva e Chiudi</button>
        </div>
      ) : (
        <div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
          <p><strong>Categorie:</strong> {note.categories.join(", ")}</p>
        </div>
      )}
      <button onClick={() => setEditMode(!editMode)}>{editMode ? "Annulla" : "Modifica"}</button>
    </div>
  );
};

export default NotesDetail;
