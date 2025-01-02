import User from "../models/User.js";
import Event from "../models/Event.js";
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

    for (const event of events) {
      const eventStartTime = new Date(event.start);

      const allDayEvent = event.allDay;

      for (const notification of event.extendedProps.notifications) {
        const notificationTime = new Date(
          eventStartTime.getTime() - notification.timeBefore * 60 * 1000
        );

        if (!notification.isSent && (notificationTime.getTime() === timeMachineValue.getTime() || allDayEvent)) {

          let emailMessage;

          if (allDayEvent) {
            emailMessage = `The event - ${event.title} is happening now!`;
          } else {
            emailMessage = `The event - ${event.title} is happening ${timeOptions[notification.timeBefore]}`;
          }

          for (const method of notification.methods) {
            try {
              if (method === "email") {
                await sendEmailNotification(
                  user.email,
                  `Reminder: ${event.title}`,
                  emailMessage
                );
              } else if (method === "whatsapp") {
                // Add WhatsApp notification logic here
              }
            } catch (error) {
              console.error(`Failed to send ${method} notification:`, error);
            }
          }

          if (allDayEvent) {
            break;
          }

        }
      }
    }
  } catch (err) {
    console.error("Error scheduling time machine notifications:", err);
  }
};

export default triggerTimeMachineNotifications;
