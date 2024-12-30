import agenda from "../config/agenda.js";
import defineOverdueTaskJob from "../jobs/overdueTaskJob.js";

const scheduleOverdueTasks = async () => {
  try {
    defineOverdueTaskJob(agenda);

    await agenda.now("check-overdue-tasks");

    const result = await agenda.cancel({ name: "check-overdue-tasks" });
    console.log(`Removed ${result} old OVERDUE TASK JOBS.`);

    const overdueJob = await agenda.jobs({ name: "check-overdue-tasks" });
    if (overdueJob.length === 0) {
      await agenda.every("1 minute", "check-overdue-tasks");
      console.log("OVERDUE TASK JOB scheduled");
    } else {
      console.log("OVERDUE TASK JOB is already scheduled.");
    }
  } catch (err) {
    console.error("Error scheduling OVERDUE TASK JOB:", err);
  }
};

export default scheduleOverdueTasks;