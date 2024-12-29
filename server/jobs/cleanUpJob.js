import cleanUpOldJobs from "../utils/cleanUpJob.js";

export default (agenda) => {
  agenda.define("clean-up-job", async () => {
    try {
      console.log("Running cleanup job...");

      // Cleanup for event notifications
      await cleanUpOldJobs(agenda, "send-notification", "eventID");

      // Cleanup for task notifications
      await cleanUpOldJobs(agenda, "send-overdue-notification", "taskID");

      console.log("Cleanup job completed.");
    } catch (err) {
      console.error("Error running cleanup job:", err);
    }
  });
};
