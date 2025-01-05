import axiosInstance from "./axiosInstance";

export const updateTimeMachine = async (userID, time) => {
    try {
        const updateResponse = await axiosInstance.put(`time-machine/update`, { userID, time });
        return updateResponse.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error while creating or updating time machine"
      );
    }
  };


export const resetTimeMachine = async (userID) => {
  try {
    const response = await axiosInstance.put(`time-machine/reset`, { userID });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error while resetting time machine"
    );
  }
};
