import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getNotes } from "../../services/noteService";
import { AuthContext } from "../../context/AuthContext";
import noteIcon from "../../assets/notepad.png"; // Import the note icon

const NotesPreview = () => {
  const [recentNotes, setRecentNotes] = useState([]);
  const [noteCount, setNoteCount] = useState(3); // Stato per il numero di note da visualizzare, parte da 1
  const [visibility, setVisibility] = useState("all"); // Stato per la visibilità delle note
  const { isAuthenticated, loading } = useContext(AuthContext);
  const userID = localStorage.getItem("userID");

  useEffect(() => {
    if (!isAuthenticated || loading || !userID) {
      return;
    }

    const fetchNotes = async () => {
      try {
        const notes = await getNotes(userID);
        
        // Filtra le note in base alla visibilità
        const filteredNotes = notes.filter(note => {
          if (visibility === "all") return true;
          if (visibility === "public" && note.visibility === "open") return true;
          if (visibility === "restricted" && note.visibility === "restricted") return true;
          if (visibility === "private" && note.visibility === "private") return true;
          return false;
        });

        // Ordina le note per data
        const sortedNotes = filteredNotes.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Imposta le note filtrate e ordinate
        setRecentNotes(sortedNotes.slice(0, noteCount));
      } catch (error) {
        console.error("Errore durante il recupero delle note:", error);
      }
    };

    fetchNotes();
  }, [isAuthenticated, loading, userID, visibility, noteCount]);

  if (loading) {
    return <p>Caricamento...</p>;
  }

  if (!isAuthenticated) {
    return <p>Effettua il login per visualizzare le tue note.</p>;
  }

  return (
    <div className="note-preview">
      <h3>Ultime note:</h3>
      
      {/* Input per il numero di note con solo le frecce per modificarlo */}
      <div className="settings">
        <label>
          Numero di note da visualizzare: 
          <input
            type="number"
            value={noteCount}
            onChange={(e) => setNoteCount(Number(e.target.value))}
            min="1"
            max="5"
            step="1"
            // Impedisce l'inserimento diretto, permettendo solo le frecce su e giù
            onKeyDown={(e) => e.preventDefault()}
          />
        </label><br/>
        
        {/* Selettore per la visibilità */}
        <label>
          Visibilità:
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="all">Tutte</option>
            <option value="public">Pubbliche</option>
            <option value="restricted">Ristrette</option>
            <option value="private">Private</option>
          </select>
        </label>
      </div>

      {recentNotes.length > 0 ? (
        <ul className="note-list">
          {recentNotes.map((note) => (
            <div className="note-item" key={note.id}>
              <li className="note-content">
                <img src={noteIcon} alt="Note Icon" className="note-icon" />
                <h2>{note.title}</h2>
                <h4>{note.categories}</h4>
                <p>{note.content.slice(0, 30)}...</p>
                
                {/* Aggiungi la visibilità della nota */}
                <p><strong>Visibilità:</strong> {note.visibility === "open" ? "Pubblica" : note.visibility === "restricted" ? "Ristretta" : "Privata"}</p>
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
