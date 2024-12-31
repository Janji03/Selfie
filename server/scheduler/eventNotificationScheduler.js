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
      console.log(`SINGLE EVENT NOTIFICATION JOB scheduled for eventID: ${eventID}`);

      const result = await agenda.cancel({ name: jobName });
      console.log(`Removed ${result} old jobs for eventID: ${eventID}`);
    } else if (userID) {
      defineUserEventNotificationJob(agenda);
      const jobName = `check-user-event-notification-single`;
      await agenda.now(jobName, { userID });
      console.log(`USER EVENT NOTIFICATION JOB scheduled for user: ${userID}`);

      const result = await agenda.cancel({ name: jobName });
      console.log(`Removed ${result} old jobs for user: ${userID}`);
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