import agenda from "../config/agenda.js";
import Task from "../models/Task.js";

// Notification urgency intervals
const notificationIntervals = [
  { time: 0, urgencyLevel: 1 }, // Immediate deadline
  { time: 1 * 60 * 60 * 1000, urgencyLevel: 2 }, // 1 hour overdue
  { time: 12 * 60 * 60 * 1000, urgencyLevel: 3 }, // 12 hours overdue
  { time: 24 * 60 * 60 * 1000, urgencyLevel: 4 }, // 1 day overdue
  { time: 3 * 24 * 60 * 60 * 1000, urgencyLevel: 5 }, // 3 days overdue
  { time: 7 * 24 * 60 * 60 * 1000, urgencyLevel: 6 }, // 1 week overdue
];

export default (agenda) => {
  agenda.define("check-task-notifications", async () => {
    try {
      // Find tasks that need notifications
      const tasks = await Task.find({
        "extendedProps.status": "pending", // Task is still pending
        "extendedProps.isOverdue": true, // Task is overdue
        "extendedProps.notifications": true, // Notifications enabled
      });

      const now = Date.now(); // Current time

      for (const task of tasks) {
        const deadline = new Date(task.extendedProps.deadline); // Task deadline
        let notificationScheduled = false; // Track if notification is scheduled

        // Check each urgency interval
        for (const { time, urgencyLevel } of notificationIntervals) {
          const notificationTime = new Date(deadline.getTime() + time); // Calculate notification time

          // If the current time is >= notification time
          if (now >= notificationTime.getTime()) {
            if (!notificationScheduled) {
              // Schedule the notification immediately
              await agenda.schedule(new Date(), "send-overdue-notification", {
                taskID: task._id,
                urgencyLevel: urgencyLevel,
              });

              console.log(
                `Notification sent for task: ${task.title} with urgency level ${urgencyLevel}`
              );

              notificationScheduled = true;

              // Remove the job after sending notification
              await agenda.cancel({ "data.taskID": task._id }); // Clean up jobs for this task

              // Break after scheduling the most relevant notification
              break;
            }
          }
        }
      }
    } catch (err) {
      console.error("Error checking task notifications:", err);
    }
  });
};
