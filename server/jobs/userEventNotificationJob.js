import Event from "../models/Event.js";
import User from "../models/User.js";
import TimeMachine from "../models/TimeMachine.js";
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

export default (agenda) => {
  agenda.define("check-user-event-notifications", async (job) => {
    const { userID } = job.attrs.data;

    try {
      console.log("USER EVENT NOTIFICATION JOB executing...");

      const user = await User.findById(userID).select("-password");
      if (!user) {
        console.log(`User with ID ${userID} not found.`);
        return;
      }

      const events = await Event.find({
        "userID": userID,
        "extendedProps.notifications": {
          $elemMatch: { isSent: false},
        },
      });

      if (events.length === 0) {
        console.log("No event notifications found.");
      }

      for (const event of events) {
        const eventStartTime = new Date(event.start);

        let now;

        const timeMachine = await TimeMachine.findOne({ userID });

        if (timeMachine && timeMachine.isActive) {
          now = new Date(timeMachine.time.getTime());
        } else {
          now = new Date();
        }

        for (let i = 0; i < event.extendedProps.notifications.length; i++) {
          const notification = event.extendedProps.notifications[i];

          const notificationTime = new Date(eventStartTime.getTime() - notification.timeBefore * 60 * 1000);

          if (now >= notificationTime && !notification.isSent) {
            console.log(`Sending notification for event: ${event.title}`);

            const userEmail = user.email;

            const emailMessage = `The event - ${event.title} is happening ${timeOptions[notification.timeBefore]}`;

            for (const method of notification.methods) {
              if (method === "email") {
                await sendEmailNotification(
                  userEmail,
                  `Reminder: ${event.title}`, 
                  emailMessage 
                );
              } else if (method === "whatsapp") {
                console.log(
                  `Sending WhatsApp notification for: ${event.title}`
                );
                // Add WhatsApp notification logic here
              }
            }
            if (!timeMachine.isActive) {
              event.extendedProps.notifications[i].isSent = true;
              await event.save();
            }
            
            console.log(`Notification sent for event: ${event.title}`);
          }
        }
      }

    console.log("USER EVENT NOTIFICATION JOB completed.");

    } catch (err) {
      console.error("Error running USER EVENT NOTIFICATION JOB:", err);
    }
  });
};
