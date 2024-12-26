import React, { useState, useEffect } from "react";
import { updateNote } from "../../services/noteService";
import { marked } from "marked";

const NotesDetail = ({ note, onClose, refreshNotes }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(note?.content || "");
  const [editedTitle, setEditedTitle] = useState(note?.title || "");
  const [editedCategories, setEditedCategories] = useState(
    note?.categories.join(", ") || ""
  );
  const [copiedContent, setCopiedContent] = useState("");
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [markdownPreview, setMarkdownPreview] = useState("");

  useEffect(() => {
    if (note) {
      setEditMode(false); // Reset editMode when a new note is selected
      setEditedTitle(note.title);
      setEditedContent(note.content);
      setEditedCategories(note.categories.join(", "));
      setMarkdownPreview(marked(note.content || ""));
    }
  }, [note]);

  useEffect(() => {
    if (editMode) {
      setMarkdownPreview(marked(editedContent));
    } else if (note) {
      setMarkdownPreview(marked(note.content || ""));
    }
  }, [editedContent, editMode]);

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
        onClose();
      })
      .catch(console.error);
  };

  const handleCopy = () => {
    if (note) {
      setCopiedContent(note.content);
      alert("Contenuto copiato!");
    }
  };

  const handlePaste = () => {
    if (editMode && copiedContent) {
      setEditedContent((prevContent) => prevContent + copiedContent);
      alert("Contenuto incollato!");
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
              <button className="note-button" onClick={handlePaste}>
                Incolla
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
              <button className="note-button" onClick={handleCopy}>
                Copia contenuto
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
      )}
    </div>
  );
};

export default NotesDetail;
