import React, { useState, useEffect, useContext } from "react";
import { updateNote } from "../../services/noteService";
import { getAllUserIds } from "../../services/userService";
import { marked } from "marked";
import { AuthContext } from "../../context/AuthContext"; // Importa il contesto

const NotesDetail = ({ note, onClose, refreshNotes }) => {
  const userID = localStorage.getItem("userID");
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(note?.content || "");
  const [editedTitle, setEditedTitle] = useState(note?.title || "");
  const [editedCategories, setEditedCategories] = useState(
    note?.categories.join(", ") || ""
  );
  const [visibility, setVisibility] = useState(note?.visibility || "open");
  const [userList, setUserList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(note?.accessList || []);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [markdownPreview, setMarkdownPreview] = useState("");

  useEffect(() => {
    if (note) {
      setEditMode(false); // Reset editMode when a new note is selected
      setEditedTitle(note.title);
      setEditedContent(note.content);
      setEditedCategories(note.categories.join(", "));
      setMarkdownPreview(marked(note.content || ""));
      setVisibility(note.visibility);
      setSelectedUsers(note.accessList || []);
    }
  }, [note]);

  useEffect(() => {
    if (editMode) {
      setMarkdownPreview(marked(editedContent));
    } else if (note) {
      setMarkdownPreview(marked(note.content || ""));
    }
  }, [editedContent, editMode]);

  // Carica gli utenti solo se la visibilità è "restricted"
  useEffect(() => {
    if (visibility === "restricted") {
      getAllUserIds().then(setUserList).catch(console.error);
    }
  }, [visibility]);

const handleSave = () => {
  if (!note) return;

  const updatedNote = {
    title: editedTitle,
    content: editedContent,
    categories: editedCategories.split(",").map((cat) => cat.trim()),
    visibility,
    accessList: visibility === "restricted" ? selectedUsers : [],
  };

  console.log("Updated note: ", updatedNote); // Aggiungi questa linea per il debug

  updateNote(note._id, updatedNote)
    .then(() => {
      refreshNotes(); // Ricarica le note
      setEditMode(false); // Disabilita la modalità di modifica
      onClose(); // Chiudi il form di modifica
    })
    .catch(console.error);
};


  const handleUserSelection = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const toggleMarkdownPreview = () => {
    setShowMarkdownPreview((prevState) => !prevState);
  };

  if (!note) return null;

  return (
    <div className="note-detail-container">
      {editMode ? (
        <React.Fragment>
          <div className="edit-note-card">
            <h2>Modifica Nota</h2>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Modifica Titolo"
              required
              
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Modifica Contenuto"
              required
            />
            <input
              type="text"
              value={editedCategories}
              onChange={(e) => setEditedCategories(e.target.value)}
              placeholder="Modifica Categorie (separate da virgola)"
              required
              
            />
            
            {note.userID === userID && (  // Solo il proprietario può vedere le opzioni di visibilità
              <div className="visibility-options">
                <label>
                  <input
                    type="radio"
                    value="open"
                    checked={visibility === "open"}
                    onChange={() => setVisibility("open")}
                  />
                  Pubblica
                </label>
                <label>
                  <input
                    type="radio"
                    value="private"
                    checked={visibility === "private"}
                    onChange={() => setVisibility("private")}
                  />
                  Privata
                </label>
                <label>
                  <input
                    type="radio"
                    value="restricted"
                    checked={visibility === "restricted"}
                    onChange={() => setVisibility("restricted")}
                  />
                  Ristretta
                </label>
              </div>
            )}

            {visibility === "restricted" && note.userID === userID && (  // Mostra la lista degli utenti solo se la visibilità è "restricted"
              <div className="user-selection">
                <h3>Seleziona gli utenti:</h3>
                <ul>
                  {userList.map((user) => (
                    <li key={user}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user)}
                          onChange={() => handleUserSelection(user)}
                        />
                        {user}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="note-actions">
              <button className="save-note-button" onClick={handleSave}>
                Salva e Chiudi
              </button>
              <button
                className="note-button"
                onClick={() => setEditMode(false)}
              >
                Annulla
              </button>
              <button
                className="note-button"
                onClick={toggleMarkdownPreview}
              >
                {showMarkdownPreview ? "Nascondi Anteprima" : "Mostra Anteprima"}
              </button>
            </div>
          </div>

          {showMarkdownPreview && (
            <div className="markdown-preview">
              <h2>Anteprima Markdown</h2>
              <div
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: markdownPreview }}
              ></div>
            </div>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="note-view-card">
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <p>
              <strong>Categorie:</strong> {note.categories.join(", ")}
            </p>
            <p>
              <strong>Visibilità:</strong> {note.visibility}
            </p>
            {note.visibility === "restricted" && (
              <p>
                <strong>Accesso:</strong> {note.accessList.join(", ")}
              </p>
            )}
            <div className="note-actions">
              <button
                className="note-button"
                onClick={() => setEditMode(true)}
              >
                Modifica
              </button>
              <button className="note-button" onClick={onClose}>
                Chiudi
              </button>
            </div>
          </div>

          {showMarkdownPreview && (
            <div className="markdown-preview">
              <h2>Anteprima Markdown</h2>
              <div
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: markdownPreview }}
              ></div>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default NotesDetail;
