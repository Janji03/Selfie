import { v4 as uuidv4 } from "uuid";
import { DateTime } from "luxon";
import RecurrenceHandler from "./RecurrenceHandler";
import DateUtilities from "../DateUtilities";
import { getUser } from "../../../services/userService";

import {
  getEventById,
  createNewEvent,
  updateEvent,
  deleteEvent,
  sendEventAsICalendar,
} from "../../../services/eventService";

const EventHandler = ({
  userID,
  events,
  setEvents,
  selectedEvent,
  setSelectedEvent,
  setSelectedOccurrence,
  setSelectedRange,
  isEditMode,
  setIsEditMode,
  setIsFormOpen,
  setEventFormInitialData,
  calendarTimeZone,
}) => {
  const {
    handleRecurrence,
    calculateDuration,
    parseRRule,
    calculateEndDateRecurrence,
  } = RecurrenceHandler();

  const { decrementOneDay, addOneHour, convertEventTimes } = DateUtilities({
    calendarTimeZone,
  });

  const handleEventClick = async (info, clickedItemId) => {
    try {
      const clickedEvent = await getEventById(clickedItemId);
      if (clickedEvent && clickedEvent.rrule) {
        setSelectedOccurrence(info.event.start);
      }
      setSelectedEvent(clickedEvent);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const handleEditEvent = () => {
    if (selectedEvent) {
      let rruleParsed = null;
      if (selectedEvent.rrule) {
        rruleParsed = parseRRule(
          selectedEvent.rrule,
          selectedEvent.extendedProps.recurrenceType === "CUSTOM",
          selectedEvent.start
        );
      }

      const notifications = selectedEvent.extendedProps.notifications || [];
      const formattedNotifications = notifications.map((notif) => {
        return {
          timeBefore: notif.timeBefore || 0,
        };
      });

      setEventFormInitialData({
        title: selectedEvent.title,
        startDate: DateTime.fromISO(selectedEvent.start, { zone: "UTC" })
          .setZone(calendarTimeZone)
          .toISO()
          .split("T")[0],
        startTime: DateTime.fromISO(selectedEvent.start, { zone: "UTC" })
          .setZone(calendarTimeZone)
          .toISO()
          .split("T")[1]
          .slice(0, 5),
        endDate: selectedEvent.allDay
          ? decrementOneDay(
              DateTime.fromISO(selectedEvent.end, { zone: "UTC" })
                .setZone(calendarTimeZone)
                .toISO()
                .split("T")[0]
            )
          : DateTime.fromISO(selectedEvent.end, { zone: "UTC" })
              .setZone(calendarTimeZone)
              .toISO()
              .split("T")[0],
        endTime: DateTime.fromISO(selectedEvent.end, { zone: "UTC" })
          .setZone(calendarTimeZone)
          .toISO()
          .split("T")[1]
          .slice(0, 5),
        allDay: selectedEvent.allDay,
        isRecurring: rruleParsed ? true : false,
        location: selectedEvent.extendedProps.location,
        description: selectedEvent.extendedProps.description,
        timeZone: selectedEvent.extendedProps.timeZone,
        recurrence: rruleParsed
          ? rruleParsed
          : {
              type: "DAILY",
              frequency: "DAILY",
              interval: 1,
              daysOfWeek: [
                new Date(selectedEvent.start.split("T")[0])
                  .toLocaleString("en-US", { weekday: "long" })
                  .slice(0, 2)
                  .toUpperCase(),
              ],
              monthlyType: "daysOfMonth",
              monthDays: [
                new Date(selectedEvent.start.split("T")[0]).getDate(),
              ],
              ordinal: "+1",
              dayOfWeek: "sunday",
              yearMonths: [
                new Date(selectedEvent.start.split("T")[0]).getMonth() + 1,
              ],
              triggerDaysOfWeek: false,
              endCondition: "never",
              endDate: calculateEndDateRecurrence(
                selectedEvent.start.split("T")[0],
                "DAILY"
              ),
              endOccurrences: 2,
            },
        markAsUnavailable: selectedEvent.extendedProps.markAsUnavailable,
        notifications: formattedNotifications,
        invitedUsers: selectedEvent.extendedProps.invitedUsers,,
      });
      setIsEditMode(true);
      setIsFormOpen(true);
    }
  };

  const handleDeleteEvent = async (eventOccurrenceDate = null) => {
    if (selectedEvent) {
      try {
        if (eventOccurrenceDate) {
          const exdate = selectedEvent.exdate ? [...selectedEvent.exdate] : [];
          exdate.push(eventOccurrenceDate.toISOString());
          const updatedEvent = { ...selectedEvent, exdate };
          await updateEvent(selectedEvent.id, updatedEvent);

          const updatedEvents = events.map((evt) =>
            evt.id === selectedEvent.id ? { ...evt, exdate } : evt
          );
          setEvents(updatedEvents);
        } else {
          await deleteEvent(selectedEvent.id);
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== selectedEvent.id)
          );
        }

        setSelectedEvent(null);
        setSelectedOccurrence(null);
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleExportEvent = async () => {
    const userID = localStorage.getItem("userID");

    const user = await getUser(userID);
    if (selectedEvent) {
      const { id, title, start, end, rrule, exdate, extendedProps } =
        selectedEvent;

      const { location, description } = extendedProps;

      const event = {
        start: DateTime.fromISO(start, { zone: "utc" }).toFormat(
          "yyyyMMdd'T'HHmmss'Z'"
        ),
        end: DateTime.fromISO(end, { zone: "utc" }).toFormat(
          "yyyyMMdd'T'HHmmss'Z'"
        ),
        title: title,
        description: description,
        location: location,
      };

      if (rrule) {
        const splitRRule = rrule.split(/:/);
        const cleanedRRule = splitRRule[2];
        event.recurrenceRule = cleanedRRule;
      }

      if (exdate) {
        const formattedExdate = exdate.map((date) => {
          return DateTime.fromISO(date, { zone: "utc" }).toFormat(
            "yyyyMMdd'T'HHmmss'Z'"
          );
        });
        event.exclusionDates = formattedExdate;
      }

      try {
        await sendEventAsICalendar(id, user.email, event);
      } catch (error) {
        console.error("Failed to export event:", error);
      }
    }
  };

  const handleEventFormSubmit = async (data) => {
    const eventTimeZone = data.timeZone;
    const eventStartDateTime = `${data.startDate}T${data.startTime}:00`;
    const eventEndDateTime = `${data.endDate}T${data.endTime}:00`;

    const utcStart = DateTime.fromISO(eventStartDateTime, {
      zone: eventTimeZone,
    })
      .toUTC()
      .toISO();
    const utcEnd = DateTime.fromISO(eventEndDateTime, { zone: eventTimeZone })
      .toUTC()
      .toISO();

    const rruleString = handleRecurrence(data.recurrence, utcStart);

    const duration = calculateDuration(
      data.allDay,
      eventStartDateTime,
      eventEndDateTime
    );

    const notificationData = data.notifications.map((notif) => {
      return {
        timeBefore: notif.timeBefore,
        isSent: false,
      };
    });

    const newEvent = {
      id: uuidv4(),
      title: data.title,
      start: utcStart,
      end: utcEnd,
      allDay: data.allDay,
      rrule: rruleString,
      duration: duration,
      extendedProps: {
        location: data.location,
        description: data.description,
        notifications: notificationData,
        timeZone: eventTimeZone,
        ...(rruleString && {
          recurrenceType:
            data.recurrence.type !== "CUSTOM" ? data.recurrence.type : "CUSTOM",
        }),
        isPomodoro: data.isPomodoro,
        pomodoroSettings: {
          studyTime: data.pomodoroSettings.studyTime,
          breakTime: data.pomodoroSettings.breakTime,
          cycles: data.pomodoroSettings.cycles,
          completedCycles: data.pomodoroSettings.completedCycles,
        },
        invitedUsers: data.invitedUsers,,
        markAsUnavailable: data.markAsUnavailable
      },
      exdate: [],
    };

    if (data.markAsUnavailable) {
      newEvent.title = "Unavailable";
    }

    try {
      if (isEditMode) {
        const updatedEvent = await updateEvent(selectedEvent.id, newEvent);

        // Convert from UTC to Local Timezone
        const convertedEvent = convertEventTimes(updatedEvent);

        const updatedEvents = events.map((event) =>
          event.id === selectedEvent.id
            ? { ...event, ...convertedEvent }
            : event
        );

        setEvents(updatedEvents);
        setSelectedEvent(convertedEvent);
      } else {
        const createdEvent = await createNewEvent(newEvent, userID);

        console.log(createdEvent);

        // Convert from UTC to Local Timezone
        const convertedEvent = convertEventTimes(createdEvent);

        setEvents([...events, convertedEvent]);
      }
      setSelectedRange(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const initializeEventForm = (startDateTime) => {
    const startTime = startDateTime.includes("T")
      ? startDateTime.split("T")[1].slice(0, 5)
      : "00:00";
    const endTime = addOneHour(startTime);
    setEventFormInitialData({
      title: "",
      startDate: startDateTime.split("T")[0],
      startTime,
      endDate: startDateTime.split("T")[0],
      endTime,
      location: "",
      description: "",
      timeZone: calendarTimeZone,
      allDay: false,
      isRecurring: false,
      recurrence: {
        type: "DAILY",
        frequency: "DAILY",
        interval: 1,
        daysOfWeek: [
          new Date(startDateTime)
            .toLocaleString("en-US", { weekday: "long" })
            .slice(0, 2)
            .toUpperCase(),
        ],
        monthlyType: "daysOfMonth",
        monthDays: [new Date(startDateTime).getDate()],
        ordinal: "+1",
        dayOfWeek: "sunday",
        yearMonths: [new Date(startDateTime).getMonth() + 1],
        triggerDaysOfWeek: false,
        endCondition: "never",
        endDate: calculateEndDateRecurrence(startDateTime, "DAILY"),
        endOccurrences: 2,
      },
      notifications: [],
      invitedUsers: [],,
      markAsUnavailable: false,
    });
  };

  return {
    handleEventClick,
    handleEditEvent,
    handleDeleteEvent,
    handleExportEvent,
    handleEventFormSubmit,
    initializeEventForm,
  };
};

export default EventHandler;
