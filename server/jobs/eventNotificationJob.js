import sendEmailNotification from "../utils/sendEmailNotification.js";
import Event from "../models/Event.js";

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

export default (agenda) => {
  agenda.define("event-notification", async (job) => {
    const { event, notificationIndex, userEmail, phoneNumber } = job.attrs.data;

    const timeBefore = event.extendedProps.notifications[notificationIndex].timeBefore;
    const methods = event.extendedProps.notifications[notificationIndex].methods;

    const emailMessage = `The event - ${event.title} is happening ${timeOptions[timeBefore]}`;

    for (const method of methods) {
      try {
        if (method === "email") {
          await sendEmailNotification(
            userEmail,
            `Reminder: ${event.title}`,
            emailMessage
          );
        } else if (method === "whatsapp") {
          console.log("Sending WhatsApp notification to:", phoneNumber);
          // Add WhatsApp notification logic here
        }
      } catch (error) {
        console.error(`Failed to send ${method} notification:`, error);
      }
    }

    try {
      await Event.findOneAndUpdate( { id: event.id },
        {
          $set: {[`extendedProps.notifications.${notificationIndex}.isSent`]: true },
        },
      );
    } catch (err) {
      console.error("Error updating notification status:", err);
    }

    try {
      await job.remove();
    } catch (err) {
      console.error("Error removing job:", err);
    }
  });
};