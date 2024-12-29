import agenda from "../config/agenda.js";
import defineCleanUpJob from "../jobs/cleanUpJob.js";

const scheduleCleanUpJobs = async () => {
  try {
    console.log("Starting cleanup job...");
    defineCleanUpJob(agenda);
    const cleanupJob = await agenda.jobs({ name: "clean-up-job" });
    if (cleanupJob.length === 0) {
      await agenda.every("1 hour", "clean-up-job");
      console.log("Scheduled cleanup job.");
    } else {
      console.log("Cleanup job is already scheduled.");
    }
  } catch (err) {
    console.error("Error scheduling cleanup job:", err);
  }
};

export default scheduleCleanUpJobs;
