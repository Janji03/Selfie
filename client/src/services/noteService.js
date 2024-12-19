import axiosInstance from "./axiosInstance";

// Ottieni tutte le note associate all'utente loggato
export const getNotes = async (userID) => {
  try {
    const response = await axiosInstance.get(`notes`, {
      params: { userID },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante il recupero delle note"
    );
  }
};

// Crea una nuova nota
export const createNote = async (noteData) => {
  try {
    const response = await axiosInstance.post(`notes`, noteData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante la creazione della nota"
    );
  }
};

// Aggiorna una nota esistente
export const updateNote = async (id, noteData) => {
  try {
    const response = await axiosInstance.put(`notes/${id}`, noteData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Errore durante l'aggiornamento della nota"
    );
  }
};

// Cancella una nota
export const deleteNote = async (id) => {
  try {
    const response = await axiosInstance.delete(`notes/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Errore durante l'eliminazione della nota"
    );
  }
};

// Duplica una nota
export const duplicateNote = async (id) => {
  try {
    const response = await axiosInstance.post(`notes/${id}/duplicate`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Errore durante la duplicazione della nota"
    );
  }
};
