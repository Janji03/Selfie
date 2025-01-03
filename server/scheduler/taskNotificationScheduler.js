import User from "../models/User.js";

const urgencyIntervals = [
  0,                              // Level 0
  7 * 24 * 60 * 60 * 1000,        // Level 1 (+ 1 week)
  10 * 24 * 60 * 60 * 1000,       // Level 2 (+ 3 days)
  11 * 24 * 60 * 60 * 1000,       // Level 3 (+ 1 day)
  11.5 * 24 * 60 * 60 * 1000,     // Level 4 (+ 12 hours)
];

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
        });
      
      } else {
        const recurringNotificationJob = agenda.create("task-notification", {
          task,
          urgencyLevel: level,
          userEmail: user.email,
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