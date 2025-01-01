import Task from "../models/Task.js";
import TimeMachine from "../models/TimeMachine.js";
import sendEmailNotification from "../utils/sendEmailNotification.js";

const notificationIntervals = [
  { time: 0, urgencyLevel: 1 }, // Immediate deadline
  { time: 24 * 60 * 60 * 1000, urgencyLevel: 2 }, // 1 day overdue
  { time: 2 * 24 * 60 * 60 * 1000, urgencyLevel: 3 }, // 2 days overdue
  { time: 3 * 24 * 60 * 60 * 1000, urgencyLevel: 4 }, // 3 days overdue
  { time: 4 * 24 * 60 * 60 * 1000, urgencyLevel: 5 }, // 4 days overdue
  { time: 5 * 24 * 60 * 60 * 1000, urgencyLevel: 6 }, // 5 days overdue
  { time: 6 * 24 * 60 * 60 * 1000, urgencyLevel: 7 }, // 6 days overdue
  { time: 7 * 24 * 60 * 60 * 1000, urgencyLevel: 8 }, // 1 week overdue
  { time: 14 * 24 * 60 * 60 * 1000, urgencyLevel: 9 }, // 2 weeks overdue
  { time: 28 * 24 * 60 * 60 * 1000, urgencyLevel: 10 }, // 4 weeks overdue
];

const urgencyMessages = {
  1: "⚠️ Immediate Attention Required! Task deadline has arrived. Complete it now.",
  2: "⚠️ Task overdue by more than 1 day! Please address this immediately.",
  3: "⚠️ Task overdue by more than 2 days! Critical action required to avoid further delays.",
  4: "⚠️ Task overdue by more than 3 days! This is becoming a serious issue. Resolve it ASAP.",
  5: "⚠️ Task overdue by more than 4 days! Escalating urgency. Take action immediately.",
  6: "⚠️ Task overdue by more than 5 days! Situation critical. Immediate intervention needed!",
  7: "⚠️ Task overdue by more than 6 days! Severe delay. Requires urgent completion!",
  8: "⏰ Task overdue by more than 1 week! This needs your attention as a top priority!",
  9: "⏰ Task overdue by more than 2 weeks! Task is severely overdue. Address this now!",
  10: "⏰ Task overdue by more than 4 weeks! This is extremely overdue. Take immediate action!"  
};

export default (agenda) => {
  agenda.define("check-task-notifications", async () => {
    try {

      const tasks = await Task.find({
        "extendedProps.status": "pending",
        "extendedProps.notifications": true,
      }).populate("userID", "email");

      if (tasks.length === 0) {
        return;
      }

      for (const task of tasks) {
        const deadline = new Date(task.extendedProps.deadline);

        let now;

        const userID = task.userID;
        const timeMachine = await TimeMachine.findOne({ userID });

        if (timeMachine && timeMachine.isActive) {
          now = new Date(timeMachine.time.getTime());
        } else {
          now = new Date();
        }

        for (const { time, urgencyLevel } of notificationIntervals
          .slice()
          .reverse()) {
          const notificationTime = new Date(deadline.getTime() + time);

          if (now >= notificationTime) {
           
            const userEmail = task.userID.email;

            const urgencyMessage =
              urgencyMessages[urgencyLevel] ||
              "This task is overdue and requires action.";

            await sendEmailNotification(
              userEmail,
              `Overdue Task: ${task.title}`,
              urgencyMessage
            );

            
            break;
          }
        }
      }

    } catch (err) {
      console.error("Error running TASK NOTIFICATION JOB:", err);
    }
  });
};
