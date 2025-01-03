import sendEmailNotification from "../utils/sendEmailNotification.js";

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

export default (agenda) => {
  agenda.define("task-notification", async (job) => {
    const { task, urgencyLevel, userEmail } = job.attrs.data;

    const emailMessage = urgencyMessages[urgencyLevel];

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
