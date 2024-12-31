import agenda from "../config/agenda.js";
import defineTaskNotificationJob from "../jobs/taskNotificationJob.js";
import defineSingleTaskNotificationJob from "../jobs/singleTaskNotificationJob.js";
import defineTaskEventNotificationJob from "../jobs/userTaskNotificationJob.js";

const scheduleTaskNotifications = async (userID = null, taskID = null) => {
  try {
    if (taskID) {
      defineSingleTaskNotificationJob(agenda); 
      const jobName = `check-task-notification-single`;
      await agenda.now(jobName, { taskID });
      console.log(`SINGLE TASK NOTIFICATION JOB scheduled for taskID: ${taskID}`);

      const result = await agenda.cancel({ name: jobName });
      console.log(`Removed ${result} old jobs for taskID: ${taskID}`);
    } else if (userID) {
      defineTaskEventNotificationJob(agenda);
      const jobName = `check-task-event-notification-single`;
      await agenda.now(jobName, { userID });
      console.log(`USER TASK NOTIFICATION JOB scheduled for user: ${userID}`);

      const result = await agenda.cancel({ name: jobName });
      console.log(`Removed ${result} old jobs for user: ${userID}`);
    } else {
      defineTaskNotificationJob(agenda); 

      await agenda.now("check-task-notifications");

      const result = await agenda.cancel({ name: "check-task-notifications" });
      console.log(`Removed ${result} old TASK NOTIFICATION JOBS.`);

      const taskJob = await agenda.jobs({ name: "check-task-notifications" });
      if (taskJob.length === 0) {
        await agenda.every("1 day", "check-task-notifications");
        console.log("TASK NOTIFICATION JOB scheduled.");
      } else {
        console.log("TASK NOTIFICATION JOB is already scheduled.");
      }
    }
  } catch (err) {
    console.error("Error scheduling TASK NOTIFICATION JOB:", err);
  }
};

export default scheduleTaskNotifications;