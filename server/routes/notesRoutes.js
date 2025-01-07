import express from "express";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  duplicateNote, // Importa la funzione per duplicare la nota
} from "../controllers/notesController.js";

const router = express.Router();

// Definizione delle route esistenti
router.post("/", createNote);
router.get("/", getNotes);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

// Aggiungi la nuova route per duplicare una nota
router.post("/:id/duplicate", duplicateNote);

export default router;
