import express from 'express';
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  duplicateNote,
} from '../controllers/notesController.js';

const router = express.Router();

// Rotte per le note
router.post('/', createNote);               // Crea una nuova nota
router.get('/', getNotes);                  // Ottieni tutte le note
router.put('/:id', updateNote);             // Aggiorna una nota
router.delete('/:id', deleteNote);          // Cancella una nota
router.post('/:id/duplicate', duplicateNote); // Duplica una nota

export default router;
