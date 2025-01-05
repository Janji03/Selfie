import Event from "../models/Event.js";
import { generateEventEmail } from "../utils/generateEmail.js";
import sendEmailNotification from "../utils/sendEmailNotification.js";

export default (agenda) => {
  agenda.define("event-notification", async (job) => {
    const { event, notificationIndex, userEmail } = job.attrs.data;

    const timeBefore = event.extendedProps.notifications[notificationIndex].timeBefore;

    const emailMessage = generateEventEmail(event, timeBefore);

    try {
      await sendEmailNotification(
        userEmail,
        `Reminder: ${event.title}`,
        emailMessage
      );
    } catch (error) {
      console.error(`Failed to send email notification:`, error);
    }

    try {
      await Event.findOneAndUpdate(
        { id: event.id },
        {
          $set: {
            [`extendedProps.notifications.${notificationIndex}.isSent`]: true,
          },
        }
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
