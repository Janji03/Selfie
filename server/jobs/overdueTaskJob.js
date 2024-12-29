import Task from "../models/Task.js";

export default (agenda) => {
  agenda.define("check-overdue-tasks", async () => {
    try {
      const now = new Date();
      const nowDate = now.toISOString().split("T")[0];  

      const tasks = await Task.find({
        "extendedProps.status": "pending",
        "extendedProps.deadline": { $lt: now },
      });

      if (tasks.length === 0) {
        console.log("No overdue tasks found.");
      }

      for (const task of tasks) {
        task.extendedProps.isOverdue = true;
        task.allDay = true;
        task.start = nowDate;
        task.end = nowDate;

        await task.save();
        console.log(`Task marked as overdue: ${task.title}`);
      }

      console.log("Overdue task job completed.");
    } catch (err) {
      console.error("Error checking overdue tasks:", err);
    }
  });
};
