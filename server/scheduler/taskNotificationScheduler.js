import agenda from "../config/agenda.js";
import defineTaskNotificationJob from "../jobs/taskNotificationJob.js";
import defineSingleTaskNotificationJob from "../jobs/singleTaskNotificationJob.js";
import defineUserTaskNotificationJob from "../jobs/userTaskNotificationJob.js";

const scheduleTaskNotifications = async (userID = null, taskID = null) => {
  try {
    if (taskID) {
      defineSingleTaskNotificationJob(agenda); 
      const jobName = `check-task-notification-single`;
      await agenda.now(jobName, { taskID });
      await agenda.cancel({ name: jobName });
    } else if (userID) {
      defineUserTaskNotificationJob(agenda);
      const jobName = `check-user-task-notifications`;
      await agenda.now(jobName, { userID });
      await agenda.cancel({ name: jobName });
    } else {
      defineTaskNotificationJob(agenda); 
      await agenda.now("check-task-notifications");
      await agenda.cancel({ name: "check-task-notifications" });
      const taskJob =await agenda.jobs({ name: "check-task-notifications" });
      if (taskJob.length === 0) {
        await agenda.every("1 day", "check-task-notifications");
      } 
    }
  } catch (err) {
    console.error("Error scheduling TASK NOTIFICATION JOB:", err);
  }
};

export default scheduleTaskNotifications;