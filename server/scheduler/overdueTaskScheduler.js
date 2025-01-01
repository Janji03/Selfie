import agenda from "../config/agenda.js";
import defineOverdueTaskJob from "../jobs/overdueTaskJob.js";

const scheduleOverdueTasks = async () => {
  try {
    defineOverdueTaskJob(agenda);
    await agenda.now("check-overdue-tasks");
    await agenda.cancel({ name: "check-overdue-tasks" });
    const overdueJob = await agenda.jobs({ name: "check-overdue-tasks" });
    if (overdueJob.length === 0) {
      await agenda.every("1 minute", "check-overdue-tasks");
    } 
  } catch (err) {
    console.error("Error scheduling OVERDUE TASK JOB:", err);
  }
};

export default scheduleOverdueTasks;