import { v4 as uuidv4 } from "uuid";
import { DateTime } from "luxon";
import RecurrenceHandler from "./RecurrenceHandler";
import DateUtilities from "../DateUtilities";

import {
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
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
              endOccurrences: 1,
            },
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
          console.log("eventOccurrenceDate", eventOccurrenceDate);
          exdate.push(eventOccurrenceDate.toISOString());
          const updatedEvent = { ...selectedEvent, exdate };
          console.log("updatedEvent", updatedEvent);
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

  const handleEventFormSubmit = async (data) => {
    const eventTimeZone = data.timeZone;
    const eventStartDateTime = `${data.startDate}T${data.startTime}`;
    const eventEndDateTime = `${data.endDate}T${data.endTime}`;

    const utcStart = data.allDay
      ? `${data.startDate}T00:00:00Z`
      : DateTime.fromISO(eventStartDateTime, { zone: eventTimeZone })
          .toUTC()
          .toISO();

    const utcEnd = data.allDay
      ? `${data.endDate}T00:00:00Z`
      : DateTime.fromISO(eventEndDateTime, { zone: eventTimeZone })
          .toUTC()
          .toISO();

    const rruleString = handleRecurrence(data.recurrence, utcStart);

    const duration = calculateDuration(
      data.allDay,
      eventStartDateTime,
      eventEndDateTime
    );

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
        }
      },
      exdate: [],
    };

    console.log(newEvent);

    try {
      if (isEditMode) {
        const updatedEvent = await updateEvent(selectedEvent.id, newEvent);

        const convertedEvent = convertEventTimes(
          updatedEvent,
          calendarTimeZone
        );

        const updatedEvents = events.map((event) =>
          event.id === selectedEvent.id
            ? { ...event, ...convertedEvent }
            : event
        );
        setEvents(updatedEvents);
        setSelectedEvent(convertedEvent);
      } else {
        const createdEvent = await createEvent(newEvent, userID);
        const convertedEvent = convertEventTimes(
          createdEvent,
          calendarTimeZone
        );
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
        endOccurrences: 1,
      },
    });
  };

  return {
    handleEventClick,
    handleEditEvent,
    handleDeleteEvent,
    handleEventFormSubmit,
    initializeEventForm,
  };
};

export default EventHandler;
