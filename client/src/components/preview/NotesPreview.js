import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getNotes } from "../../services/noteService";
import { AuthContext } from "../../context/AuthContext";
import noteIcon from "../notes/notepad.png";

const NotesPreview = () => {
  const [recentNotes, setRecentNotes] = useState([]);
  const { isAuthenticated, loading } = useContext(AuthContext);
  const userID = localStorage.getItem("userID");

  useEffect(() => {
    if (!isAuthenticated || loading || !userID) {
      return;
    }

    const fetchNotes = async () => {
      try {
        const notes = await getNotes(userID);
        const sortedNotes = notes.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentNotes(sortedNotes.slice(0, 3));
      } catch (error) {
        console.error("Errore durante il recupero delle note:", error);
      }
    };

    fetchNotes();
  }, [isAuthenticated, loading, userID]);

  if (loading) {
    return <p>Caricamento...</p>;
  }

  if (!isAuthenticated) {
    return <p>Effettua il login per visualizzare le tue note.</p>;
  }

  return (
    <div className="note-preview">
      <h3>Ultime 3 note:</h3>
      {recentNotes.length > 0 ? (
        <ul className="note-list">
          {recentNotes.map((note) => (
            <div className="note-item">
              <li key={note.id} className="note-content">
                <h2>{note.title}</h2>
                <h4>{note.categories}</h4>
                <p>{note.content.slice(0, 30)}...</p>
              </li>
            </div>
          ))}
        </ul>
      ) : (
        <p>Non ci sono note recenti.</p>
      )}
      <Link to="/notes" className="note-link">
        Vai alle Note
      </Link>
    </div>
  );
};

export default NotesPreview;
