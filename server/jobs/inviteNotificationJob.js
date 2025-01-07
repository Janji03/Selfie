import sendEmailNotification from "../utils/sendEmailNotification.js";
import { DateTime } from "luxon";

export default (agenda) => {
  agenda.define("send-invite-email", async (job) => {
    const { user, event, invitee } = job.attrs.data;
    const emailSubject = `You are invited to an event: ${event.title}`;
    const baseUrl = "http://localhost:3000";

    const acceptUrl = `${baseUrl}/events/${event.id}/accept?userID=${invitee.userID}`;
    const rejectUrl = `${baseUrl}/events/${event.id}/reject?userID=${invitee.userID}`;
    const resendUrl = `${baseUrl}/events/${event.id}/resend?userID=${invitee.userID}`;

    const startISO = new Date(event.start).toISOString();
    const endISO = new Date(event.end).toISOString();
    const startDate = DateTime.fromISO(startISO, { zone: "UTC" });
    const endDate = DateTime.fromISO(endISO, { zone: "UTC" });
    const timeZone = event.extendedProps.timeZone;

    const emailBody = `
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>You have been invited to the event: <strong>${event.title}</strong>.</p>
            <p><strong>Event Start:</strong>: ${event.allDay
                ? startDate.setZone(timeZone).toLocaleString(DateTime.DATE_SHORT)
                : startDate.setZone(timeZone).toLocaleString(DateTime.DATETIME_FULL)}</p>
            <p><strong>Event End:</strong>: ${event.allDay
                ? endDate.setZone(timeZone).toLocaleString(DateTime.DATE_SHORT)
                : endDate.setZone(timeZone).toLocaleString(DateTime.DATETIME_FULL)}</p>
          <p>Please respond to this invitation:</p>
          <ul>
            <li><a href="${acceptUrl}">Accept</a></li>
            <li><a href="${rejectUrl}">Reject</a></li>
            <li><a href="${resendUrl}">Resend Reminder Later</a></li>
          </ul>
        `;

    try {
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
