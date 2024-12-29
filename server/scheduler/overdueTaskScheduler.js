import agenda from "../config/agenda.js";
import defineOverdueTaskJob from "../jobs/overdueTaskJob.js";

const scheduleOverdueTasks = async () => {
  try {
    console.log("Starting overdue tasks job...");
    defineOverdueTaskJob(agenda)
    const overdueJob = await agenda.jobs({ name: "check-overdue-tasks" });
    if (overdueJob.length === 0) {
      await agenda.every("1 minute", "check-overdue-tasks");
      console.log("Scheduled overdue tasks job.");
    } else {
      console.log("Overdue task job is already scheduled.");
    }
  } catch (err) {
    console.error("Error scheduling overdue tasks:", err);
  }
};

export default scheduleOverdueTasks;