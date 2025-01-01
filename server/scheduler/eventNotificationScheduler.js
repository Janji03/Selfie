import agenda from "../config/agenda.js";
import defineEventNotificationJob from "../jobs/eventNotificationJob.js";
import defineSingleEventNotificationJob from "../jobs/singleEventNotificationJob.js";
import defineUserEventNotificationJob from "../jobs/userEventNotificationJob.js";

const scheduleEventNotifications = async (userID = null, eventID = null) => {
  try {
    if (eventID) {
      defineSingleEventNotificationJob(agenda);
      const jobName = `check-event-notification-single`;
      await agenda.now(jobName, { eventID });
      await agenda.cancel({ name: jobName });
    } else if (userID) {
      defineUserEventNotificationJob(agenda);
      const jobName = `check-user-event-notifications`;
      await agenda.now(jobName, { userID });
      await agenda.cancel({ name: jobName });
    } else {
      defineEventNotificationJob(agenda);
      await agenda.now("check-event-notifications");
      await agenda.cancel({ name: "check-event-notifications" });
      const eventJob = await agenda.jobs({ name: "check-event-notifications" });
      if (eventJob.length === 0) {
        await agenda.every("1 minute", "check-event-notifications");
      } 
    } 

  } catch (err) {
    console.error("Error scheduling EVENT NOTIFICATION JOB:", err);
  }
};

export default scheduleEventNotifications;