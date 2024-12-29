import Event from "../models/Event.js";
import nodemailer from "nodemailer";
import config from "../config/config.js";

export default (agenda) => {
  agenda.define("send-notification", async (job) => {
    const { eventID, notificationIndex } = job.attrs.data;

    try {
      const event = await Event.findById(eventID).populate("userID");
      if (!event) throw new Error("Event not found");

      const notification = event.extendedProps.notifications[notificationIndex];
      if (!notification) throw new Error("Notification not found");

      const eventStartTime = new Date(event.start);
      const notificationTime = new Date(
        eventStartTime.getTime() - notification.timeBefore * 60 * 1000
      );

      console.log("Event Start Time:", eventStartTime);
      console.log("Notification Time:", notificationTime);

      if (Date.now() >= notificationTime.getTime()) {
        // Email transporter (create once)
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASS,
          },
        });

        for (const method of notification.methods) {
          if (method === "email") {
            console.log(`Sending email notification: ${event.title}`);

            const userEmail = event.userID.email;

            const currentTime = Date.now();
            const isEventStarted = currentTime >= eventStartTime.getTime();

            let emailHtmlContent = `
              <html>
                <body>
                  <h1>${event.title}</h1>
                  <p>${
                    isEventStarted
                      ? "The event is happening now!"
                      : `The event will start in ${Math.ceil(
                          (eventStartTime - currentTime) / 60000
                        )} minutes.`
                  }</p>
                </body>
              </html>
            `;

            await transporter.sendMail({
              from: config.EMAIL_USER,
              to: userEmail,
              subject: `Reminder: ${event.title}`,
              html: emailHtmlContent,
            });

            console.log(`Email sent to ${userEmail}`);
          } else if (method === "whatsapp") {
            console.log(`WhatsApp notification: ${event.title}`);
          }
        }

        // Mark notification as sent
        event.extendedProps.notifications[notificationIndex].isSent = true;
        await event.save();
        console.log(
          `Notification marked as sent for event: ${event.title}`
        );
      } else {
        console.log(
          `Notification time not reached yet for event: ${event.title}`
        );
      }

      // Remove job after completion
      await job.remove();
      console.log(`Job removed for event: ${event.title}`);
    } catch (err) {
      console.error("Error sending notification:", err);
    }
  });
};
