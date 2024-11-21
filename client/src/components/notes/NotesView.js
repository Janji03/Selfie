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
    <div>
      <h2>Lista Note</h2>
      <ul>
        {notes.map((note) => (
          <li key={note._id}>
            <h3>{note.title}</h3>
            <p>Categoria: {note.categories.join(", ")}</p>
            <p>{note.content.slice(0, 200)}...</p>
            <button onClick={() => setSelectedNote(note)}>Apri</button>
            <button onClick={() => handleDuplicate(note._id)}>Duplica</button>
            <button onClick={() => handleDelete(note._id)}>Elimina</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesView;
