import { generateTaskEmail } from "../utils/generateEmail.js";
import sendEmailNotification from "../utils/sendEmailNotification.js";


export default (agenda) => {
  agenda.define("task-notification", async (job) => {
    const { task, urgencyLevel, userEmail } = job.attrs.data;

    const emailMessage = generateTaskEmail(task, urgencyLevel);

    try {
      await sendEmailNotification(
        userEmail,
        `Overdue Task: ${task.title}`,
        emailMessage
      );
    } catch (error) {
      console.error(`Failed to send email notification:`, error);
    }

    if (urgencyLevel !== 4) {
      try {
        await job.remove();
      } catch (err) {
        console.error("Error removing job:", err);
      }
    }
  });
};
