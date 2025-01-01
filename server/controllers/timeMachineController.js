import TimeMachine from "../models/TimeMachine.js";
import scheduleEventNotifications from "../scheduler/eventNotificationScheduler.js";
import scheduleTaskNotifications from "../scheduler/taskNotificationScheduler.js";

export const updateTimeMachine = async (req, res) => {
  const { userID, time } = req.body;

  try {
    const timeMachine = await TimeMachine.findOne({ userID });

    if (!timeMachine) {
      return res.status(404).json({ message: "Time machine not found for this user" });
    }

    timeMachine.time = new Date(time);
    timeMachine.isActive = true;
    await timeMachine.save();

    await scheduleEventNotifications(userID);
    await scheduleTaskNotifications(userID);

    return res.status(200).json(timeMachine);  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while updating time machine" });
  }
};

export const resetTimeMachine = async (req, res) => {
  const { userID } = req.body;

  try {
    const timeMachine = await TimeMachine.findOne({ userID });

    if (!timeMachine) {
      return res.status(404).json({ message: "Time machine not found for this user" });
    }

    timeMachine.time = new Date();
    timeMachine.isActive = false;
    await timeMachine.save();

    return res.status(200).json(timeMachine);  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while resetting time machine" });
  }
};
