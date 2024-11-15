import axiosInstance from "./axiosInstance";

export const getUser = async (id, token) => {
  try {
    const response = await axiosInstance.get(`users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || `Errore durante l'estrazione utente`
    );
  }
};

export const updateUser = async (id, userData, token) => {
  try {
    const response = await axiosInstance.put(`users/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || `Errore durante l'aggiornamento utente`
    );
  }
};

export const updateUserPfp = async (id, file, token) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await axiosInstance.put(`users/${id}/pfp`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        `Errore durante l'aggiornamento della pfp utente`
    );
  }
};

export const deleteUser = async (id, token) => {
  try {
    const response = await axiosInstance.delete(`users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante la cancellazione utente"
    );
  }
};
