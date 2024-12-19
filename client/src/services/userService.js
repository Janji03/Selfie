import axiosInstance from "./axiosInstance";

export const getUser = async (id) => {
  try {
    const response = await axiosInstance.get(`users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || `Errore durante l'estrazione utente`
    );
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axiosInstance.put(`users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || `Errore durante l'aggiornamento utente`
    );
  }
};

export const updateUserProfilePicture = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await axiosInstance.put(`users/${id}/pfp`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("response.data", response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        `Errore durante l'aggiornamento della pfp utente`
    );
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante la cancellazione utente"
    );
  }
};
