import agenda from "../config/agenda.js";
import defineEventNotificationScheduler from "../scheduler/eventNotificationScheduler.js";
import defineTaskNotificationScheduler from "../scheduler/taskNotificationScheduler.js";

const scheduleNotifications = async () => {
  try {
    console.log("Starting event notifications job...");
    defineEventNotificationScheduler(agenda);
    const eventJob = await agenda.jobs({ name: "check-event-notifications" });
    if (eventJob.length === 0) {
      await agenda.every("1 minute", "check-event-notifications");
      console.log("Scheduled event notifications job.");
    } else {
      console.log("Event notifications job is already scheduled.");
    }

    console.log("Starting task notifications job...");
    defineTaskNotificationScheduler(agenda);
    const taskJob = await agenda.jobs({ name: "check-task-notifications" });
    if (taskJob.length === 0) {
      await agenda.every("1 minute", "check-task-notifications");
      console.log("Scheduled task notifications job.");
    } else {
      console.log("Task notifications job is already scheduled.");
    }

  } catch (err) {
    console.error("Error scheduling notifications:", err);
  }
};

export default scheduleNotifications;