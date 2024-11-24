import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getNotes } from "../../services/noteService";
import { AuthContext } from "../../context/AuthContext";

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
        const sortedNotes = notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
    <div>
      <h3>Preview Note</h3>
      <p> prendi note e appunti in modo intelligente.</p>
      {recentNotes.length > 0 ? (
        <ul>
          {recentNotes.map((note) => (
            <li key={note.id}>
              <h2>{note.title}</h2>
              <h4>{note.categories}</h4>
              <p>{note.content.slice(0, 30)}...</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Non ci sono note recenti.</p>
      )}
      <Link to="/notes">Vai alle Note</Link>
    </div>
  );
};

export default NotesPreview;
