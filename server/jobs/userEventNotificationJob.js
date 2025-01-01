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

      const user = await User.findById(userID).select("-password");
      if (!user) {
        return;
      }

      const events = await Event.find({
        "userID": userID,
        "extendedProps.notifications": {
          $elemMatch: { isSent: false},
        },
      });

      if (events.length === 0) {
        return;
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
                // Add WhatsApp notification logic here
              }
            }
            if (!timeMachine.isActive) {
              event.extendedProps.notifications[i].isSent = true;
              await event.save();
            }
            
          }
        }
      }

    } catch (err) {
      console.error("Error running USER EVENT NOTIFICATION JOB:", err);
    }
  });
};
