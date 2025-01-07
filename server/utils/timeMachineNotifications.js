import User from "../models/User.js";
import Event from "../models/Event.js";
import Task from "../models/Task.js";
import { generateEventEmail, generateTaskEmail } from "./generateEmail.js";
import sendEmailNotification from "../utils/sendEmailNotification.js";

const urgencyIntervals = [
  0, // Level 0
  7 * 24 * 60 * 60 * 1000, // Level 1 (+ 1 week)
  10 * 24 * 60 * 60 * 1000, // Level 2 (+ 3 days)
  11 * 24 * 60 * 60 * 1000, // Level 3 (+ 1 day)
  11.5 * 24 * 60 * 60 * 1000, // Level 4 (+ 12 hours)
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

        const timeBefore = notification.timeBefore;

        if (
          !notification.isSent &&
          (Math.abs(notificationTime.getTime() - timeMachineValue.getTime()) <=
            30000 ||
            allDayEvent)
        ) {
          const emailMessage = generateEventEmail(event, timeBefore);

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

      let urgencyLevel = 0;
      if (overdueTime > 0) {
        for (let i = 0; i < urgencyIntervals.length; i++) {
          if (overdueTime >= urgencyIntervals[i]) {
            urgencyLevel = i;
          }
        }
      }

      const emailMessage = generateTaskEmail(task, urgencyLevel);

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
