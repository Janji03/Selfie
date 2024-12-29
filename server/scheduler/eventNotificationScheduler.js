import agenda from "../config/agenda.js";
import Event from "../models/Event.js";

export default (agenda) => {
  agenda.define("check-event-notifications", async () => {
    try {
      console.log("Checking event notifications...");

      // Find events with pending notifications
      const events = await Event.find({
        "extendedProps.notifications": {
          $elemMatch: { isSent: false }, // Notifications that are not sent yet
        },
      });

      const now = Date.now(); // Current time

      for (const event of events) {
        for (let i = 0; i < event.extendedProps.notifications.length; i++) {
          const notification = event.extendedProps.notifications[i];

          // Calculate the notification time
          const eventStartTime = new Date(event.start);
          const notificationTime = new Date(
            eventStartTime.getTime() - notification.timeBefore * 60 * 1000
          );

          // Check if the notification should be sent
          if (now >= notificationTime.getTime() && !notification.isSent) {
            // Schedule and send the notification immediately
            await agenda.now("send-notification", {
              eventID: event._id,
              notificationIndex: i,
            });

            console.log(
              `Notification sent for event: ${event.title} at urgency level ${notification.timeBefore} minutes before start`
            );

            // Mark the notification as sent
            event.extendedProps.notifications[i].isSent = true;
            await event.save(); // Save the updated event
          }
        }
      }
    } catch (err) {
      console.error("Error checking event notifications:", err);
    }
  });
};

