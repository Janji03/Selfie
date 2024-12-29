import Task from "../models/Task.js";
import nodemailer from "nodemailer";
import config from "../config/config.js";

export default (agenda) => {
  agenda.define("send-overdue-notification", async (job) => {
    const { taskID, urgencyLevel } = job.attrs.data;

    try {
      const task = await Task.findById(taskID).populate("userID");
      if (!task) throw new Error("Task not found");

      const userEmail = task.userID.email;
      console.log(
        `Sending overdue notification for: ${task.title} with urgency level ${urgencyLevel}`
      );

      // Email transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.EMAIL_USER,
          pass: config.EMAIL_PASS,
        },
      });

      let urgencyMessage = "";
      switch (urgencyLevel) {
        case 1:
          urgencyMessage = "This task is due now!";
          break;
        case 2:
          urgencyMessage =
            "This task is 1 hour overdue. Please address it as soon as possible.";
          break;
        case 3:
          urgencyMessage =
            "This task is 12 hours overdue. It's becoming increasingly urgent!";
          break;
        case 4:
          urgencyMessage =
            "This task is 1 day overdue. Please resolve it urgently!";
          break;
        case 5:
          urgencyMessage =
            "This task is 3 days overdue. It's critical that you take action!";
          break;
        case 6:
          urgencyMessage =
            "This task is over 1 week overdue. Immediate action is required!";
          break;
        default:
          urgencyMessage = "This task is overdue and requires action.";
      }

      let emailHtmlContent = `
        <html>
          <body>
            <h1>Overdue Task: ${task.title}</h1>
            <p>${urgencyMessage}</p>
          </body>
        </html>
      `;

      await transporter.sendMail({
        from: config.EMAIL_USER,
        to: userEmail,
        subject: `Overdue Task: ${task.title}`,
        html: emailHtmlContent,
      });

      console.log(`Overdue email sent to ${userEmail}`);

      // Remove job after execution
      await job.remove();
      console.log(`Job removed for task: ${task.title}`);
    } catch (err) {
      console.error("Error sending overdue notification:", err);
    }
  });
};
