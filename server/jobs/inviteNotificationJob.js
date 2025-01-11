import sendEmailNotification from "../utils/sendEmailNotification.js";
import { DateTime } from "luxon";

export default (agenda) => {
  agenda.define("send-invite-email", async (job) => {
    const { user, item, invitee, type } = job.attrs.data; 
    const emailSubject = `You are invited to a ${type}: ${item.title}`;
    const baseUrl = "http://localhost:3000";

    const acceptUrl = `${baseUrl}/${type}s/${item.id}/accept?userID=${invitee.userID}`;
    const rejectUrl = `${baseUrl}/${type}s/${item.id}/reject?userID=${invitee.userID}`;
    const resendUrl = `${baseUrl}/${type}s/${item.id}/resend?userID=${invitee.userID}`;

    let emailBody = `
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>You have been invited to the ${type}: <strong>${item.title}</strong>.</p>`;

    try {
      if (type === "event") {
        const startISO = new Date(item.start).toISOString();
        const endISO = new Date(item.end).toISOString();
        const startDate = DateTime.fromISO(startISO, { zone: "UTC" });
        const endDate = DateTime.fromISO(endISO, { zone: "UTC" });
        const timeZone = item.extendedProps.timeZone;

        emailBody += `
          <p><strong>Event Start:</strong>: ${item.allDay
            ? startDate.setZone(timeZone).toLocaleString(DateTime.DATE_SHORT)
            : startDate.setZone(timeZone).toLocaleString(DateTime.DATETIME_FULL)}</p>
          <p><strong>Event End:</strong>: ${item.allDay
            ? endDate.setZone(timeZone).toLocaleString(DateTime.DATE_SHORT)
            : endDate.setZone(timeZone).toLocaleString(DateTime.DATETIME_FULL)}</p>`;
      } else if (type === "task") {
        const deadlineISO = new Date(item.extendedProps.deadline).toISOString();
        const deadline = DateTime.fromISO(deadlineISO, { zone: "UTC" });
        const timeZone = item.extendedProps.timeZone;

        emailBody += `
          <p><strong>Task Deadline:</strong> ${item.allDay
            ? deadline.setZone(timeZone).toLocaleString(DateTime.DATE_SHORT)
            : deadline.setZone(timeZone).toLocaleString(DateTime.DATETIME_FULL)}</p>`;
      }

      emailBody += `
        <p>Please respond to this invitation:</p>
        <ul>
          <li><a href="${acceptUrl}">Accept</a></li>
          <li><a href="${rejectUrl}">Reject</a></li>
          <li><a href="${resendUrl}">Resend Reminder Later</a></li>
        </ul>
      `;

      await sendEmailNotification(user.email, emailSubject, emailBody);
    } catch (error) {
      console.error(`Failed to send email notification:`, error);
    }

    try {
      await job.remove();
    } catch (err) {
      console.error("Error removing job:", err);
    }
  });
};
