import agenda from "../config/agenda.js";
import defineEventNotificationJob from "../jobs/eventNotificationJob.js";
import defineSingleEventNotificationJob from "../jobs/singleEventNotificationJob.js";

const scheduleEventNotifications = async (eventID = null) => {
  try {
    if (eventID) {
      defineSingleEventNotificationJob(agenda);
      const jobName = `check-event-notification-single`;
      const result = await agenda.cancel({ name: jobName });
      console.log(`Removed ${result} old jobs for eventID: ${eventID}`);

      await agenda.now(jobName, { eventID });
      console.log(`SINGLE EVENT NOTIFICATION JOB scheduled for eventID: ${eventID}`);
    } else {
      defineEventNotificationJob(agenda);
      
      await agenda.now("check-event-notifications");
  
      const result = await agenda.cancel({ name: "check-event-notifications" });
      console.log(`Removed ${result} old EVENT NOTIFICATION JOBS.`);
      
      const eventJob = await agenda.jobs({ name: "check-event-notifications" });
      if (eventJob.length === 0) {
        await agenda.every("1 minute", "check-event-notifications");
        console.log("EVENT NOTIFICATION JOB scheduled.");
      } else {
        console.log("EVENT NOTIFICATION JOB is already scheduled.");
      }
    }

  } catch (err) {
    console.error("Error scheduling EVENT NOTIFICATION JOB:", err);
  }
};

export default scheduleEventNotifications;