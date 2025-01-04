import getRecurrenceSummary from "./getRecurrenceSummary.js";
import { DateTime } from "luxon";

const loginURL = `http://localhost:3000/calendar/`;

export const generateEventEmail = (event, timeBefore) => {

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

        const title = event.title;
        const startISO = new Date(event.start).toISOString();
        const endISO = new Date(event.end).toISOString();
        const startDate = DateTime.fromISO(startISO, { zone: "UTC" });
        const endDate = DateTime.fromISO(endISO, { zone: "UTC" });
        const timeZone = event.extendedProps.timeZone;
        const location = event.extendedProps.location;
        const description = event.extendedProps.description;
        const allDayEvent = event.allDay;
        const rrule = event.rrule;

        const emailMessage = `
    <div>
        <p>Hello,</p>
        <p>This is a reminder that the event <strong>"${title}"</strong> is happening ${
            allDayEvent ? "now!" : timeOptions[timeBefore]}
        </p>
        <p><strong>Event Details:</strong></p>
        <ul>
            <li><strong>Title:</strong> ${title}</li>
            <li><strong>Start:</strong> ${
                allDayEvent
                    ? startDate.setZone(timeZone).toLocaleString(DateTime.DATE_SHORT)
                    : startDate.setZone(timeZone).toLocaleString(DateTime.DATETIME_FULL)
            }</li>
            <li><strong>End:</strong> ${
                allDayEvent
                    ? endDate.setZone(timeZone).toLocaleString(DateTime.DATE_SHORT)
                    : endDate.setZone(timeZone).toLocaleString(DateTime.DATETIME_FULL)
            }</li>
            <li><strong>Location:</strong> ${location || ""}</li>
            <li><strong>Description:</strong> ${description || ""}</li>
            <li><strong>Time Zone:</strong> ${timeZone}</li>
            ${rrule ? `<li><strong>Repeats:</strong> ${getRecurrenceSummary(rrule)}</li>` : ""}
        </ul>
        <p>If you need to update or cancel this event, please <a href="${loginURL}">log in</a> to your calendar application.</p>
    </div>`;

  return emailMessage;
};

export const generateTaskEmail = (task, urgencyLevel) => {
  const messages = {
      0: `<p>The task <strong>"${task.title}"</strong> is overdue. Please review it as soon as possible.</p>
          <p>You will receive another notification in a week if this task remains incomplete.</p>`,

      1: `<p>The task <strong>"${task.title}"</strong> is still overdue. Please take action soon.</p>
          <p>You will receive another notification in 3 days if the task is not completed.</p>`,

      2: `<p>This is a reminder that the task <strong>"${task.title}"</strong> is overdue and requires your attention.</p>
          <p>You will receive another notification tomorrow if no action is taken.</p>`,

      3: `<p>The task <strong>"${task.title}"</strong> is becoming increasingly urgent. Please address it immediately.</p>
          <p>You will receive another notification in 12 hours if the task remains incomplete.</p>`,

      4: `<p>This is a critical reminder that the task <strong>"${task.title}"</strong> is overdue and needs immediate attention.</p>
          <p>You will continue to receive notifications every 12 hours until this task is completed.</p>`
  };

  const urgencyMessage = messages[urgencyLevel] + `
      <p>To stop receiving notifications, mark the task as completed or disable notifications.</p>
      <p>If you need to update or cancel this task, please <a href="${loginURL}">log in</a> to your calendar application.</p>`;

  const emailMessage = `
    <p>Hello,</p>
      ${urgencyMessage}
    </div>`;

  return emailMessage;
};