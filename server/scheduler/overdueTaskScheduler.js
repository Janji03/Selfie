import agenda from "../config/agenda.js";

const scheduleOverdueTasks = async () => {
  try {
    const overdueJob = await agenda.jobs({ name: "check-overdue-tasks" });
    if (overdueJob.length === 0) {
      await agenda.every("* * * * *", "check-overdue-tasks");
    } 
  } catch (err) {
    console.error("Error scheduling OVERDUE TASK JOB:", err);
  }
};

export default scheduleOverdueTasks;