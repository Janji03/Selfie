import User from "../models/User.js";

const urgencyIntervals = {
  0: 0,                                               // Deadline reached (level 0)
  1: 7 * 24 * 60 * 60 * 1000,                         // Previous + 1 week (level 1)
  2: 10 * 24 * 60 * 60 * 1000,                        // Previous + 3 days (level 2)
  3: 11 * 24 * 60 * 60 * 1000,                        // Previous + 1 day (level 3)
  4: 11.5 * 24 * 60 * 60 * 1000,                      // Previous + 12 hours (level 4)
};

const scheduleTaskNotifications = async (agenda, userID, task) => {
  try {

    if (!userID || !task || !task.extendedProps.notifications || task.extendedProps.status === "completed") {
      return;
    }

    const user = await User.findById(userID).select("-password");

    if (!user) {
      return;
    }

    const taskDeadline = new Date(task.extendedProps.deadline);
    
    for (let level = 0; level <= 4; level++) {
      if (level !== 4) {
        const nextNotificationTime = new Date(taskDeadline.getTime() + urgencyIntervals[level]);
        await agenda.schedule(nextNotificationTime, "task-notification", {
          task,
          urgencyLevel: level,
          userEmail: user.email,
          // phoneNumber: user.phoneNumber,
        });
      
      } else {
        const recurringNotificationJob = agenda.create("task-notification", {
          task,
          urgencyLevel: level,
          userEmail: user.email,
          // phoneNumber: user.phoneNumber,
        });
        const firstRunTime = new Date(taskDeadline.getTime() + urgencyIntervals[level - 1]);
        recurringNotificationJob.schedule(firstRunTime);
        recurringNotificationJob.repeatEvery('12 hours', { skipImmediate: true });
        await recurringNotificationJob.save();
      }
    }
    
  } catch (err) {
    console.error("Error scheduling task notification:", err);
  }
};

export default scheduleTaskNotifications;