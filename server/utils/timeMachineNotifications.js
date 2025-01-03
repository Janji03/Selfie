import User from "../models/User.js";
import Event from "../models/Event.js";
import Task from "../models/Task.js";
import sendEmailNotification from "../utils/sendEmailNotification.js";

const timeOptions = {
  0: "now!",
  5: "in 5 minutes!",
  10: "in 10 minutes!",
  15: "in 15 minutes!",
  30: "in 30 minutes!",
  60: "in 1 hour!",
  120: "in 2 hours!",
  1440: "in 1 day!",
  2880: "in 2 days!",
  10080: "in 1 week!",
};

const urgencyMessages = {
  0: `<p></p>
  <p>You will receive another notification in a week...</p>
  <p>To stop getting notifications either mark the task as completed or disable the notifications</p>`,
  1: `<p></p>
  <p>You will receive another notification in 3 days...</p>
  <p>To stop getting notifications either mark the task as completed or disable the notifications</p>`,
  2: `<p></p>
  <p>You will receive another notification tomorrow...</p>
  <p>To stop getting notifications either mark the task as completed or disable the notifications</p>`,
  3: `<p></p>
  <p>You will receive another notification in 12 hours...</p>
  <p>To stop getting notifications either mark the task as completed or disable the notifications</p>`,
  4: `<p></p>
  <p>You will receive a notification every 12 hours from now on...</p>
  <p>To stop getting notifications either mark the task as completed or disable the notifications</p>`,
};

const urgencyIntervals = [
  0,                              // Level 0
  7 * 24 * 60 * 60 * 1000,        // Level 1 (+ 1 week)
  10 * 24 * 60 * 60 * 1000,       // Level 2 (+ 3 days)
  11 * 24 * 60 * 60 * 1000,       // Level 3 (+ 1 day)
  11.5 * 24 * 60 * 60 * 1000,     // Level 4 (+ 12 hours)
];

const triggerTimeMachineNotifications = async (userID, timeMachine) => {
  try {
    if (!userID || !timeMachine) {
      return;
    }

    const user = await User.findById(userID).select("-password");

    if (!user) {
      return;
    }

    const timeMachineValue = timeMachine.time;

    const startOfDay = new Date(timeMachineValue);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(timeMachineValue);
    endOfDay.setHours(23, 59, 59, 999);

    const events = await Event.find({
      userID: userID,
      start: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    const tasks = await Task.find({
      userID: userID,
      start: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      "extendedProps.status": "pending",
      "extendedProps.temporary": true,
      "extendedProps.notifications": true,
      "extendedProps.isOverdue": true,
    });

    for (const event of events) {
      const eventStartTime = new Date(event.start);

      const allDayEvent = event.allDay;

      for (const notification of event.extendedProps.notifications) {
        const notificationTime = new Date(
          eventStartTime.getTime() - notification.timeBefore * 60 * 1000
        );

        if (!notification.isSent && (Math.abs(notificationTime.getTime() - timeMachineValue.getTime()) <= 30000 || allDayEvent)) {

          let emailMessage;

          if (allDayEvent) {
            emailMessage = `The event - ${event.title} is happening now!`;
          } else {
            emailMessage = `The event - ${event.title} is happening ${timeOptions[notification.timeBefore]}`;
          }


            try {

                await sendEmailNotification(
                  user.email,
                  `Reminder: ${event.title}`,
                  emailMessage
                );
              
            } catch (error) {
              console.error(`Failed to send email notification:`, error);
            }
          

          if (allDayEvent) {
            break;
          }

        }
      }
    }

    for (const task of tasks) {
      const taskDeadline = new Date(task.extendedProps.deadline);
      const overdueTime = timeMachineValue - taskDeadline;

      console.log("TaskDeadline: ", taskDeadline);
      console.log("Overdue Time: ", overdueTime);

      let urgencyLevel = 0;
      if (overdueTime > 0) {
        for (let i = 0; i < urgencyIntervals.length; i++) {
          if (overdueTime >= urgencyIntervals[i]) {
            urgencyLevel = i;
          }
        }
      }
        
      const emailMessage = urgencyMessages[urgencyLevel];
        
      
        try {
            await sendEmailNotification(
              user.email,
              `Overdue Task: ${task.title}`,              
              emailMessage
            );
        } catch (error) {
          console.error(`Failed to send email notification:`, error);
        }
    }

  } catch (err) {
    console.error("Error scheduling time machine notifications:", err);
  }
};

export default triggerTimeMachineNotifications;
