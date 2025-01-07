import Task from "../models/Task.js";

const removeTemporaryTasks = async (userID) => {
  try {
    await Task.deleteMany({
      "extendedProps.temporary": true,
      userID: userID,
    });
    
    console.log("Temporary tasks cleared");
  } catch (error) {
    console.log("Failed to clear temporary tasks: ", error);
  }
};

export default removeTemporaryTasks;
