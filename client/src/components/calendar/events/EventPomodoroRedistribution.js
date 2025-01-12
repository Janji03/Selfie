import { getEvents, updateEvent, createNewEvent } from "../../../services/eventService";
import { v4 as uuidv4 } from "uuid";

const redistributePomodoroTime = async (userID, currentDate, setEvents) => {
  try {
    const events = await getEvents(userID); //ottiei eventi

    
    const uncompletedPomodoros = events.filter((event) => { //returna i pomodori non completati
      const { completedCycles, cycles } = event.extendedProps.pomodoroSettings || {};
      return (
        event.extendedProps.isPomodoro &&
        completedCycles < cycles &&
        new Date(event.end) < new Date(currentDate)  //new per averla in formato adatto a js
      );
    });

    let nextDate = new Date(currentDate);

    for (const event of uncompletedPomodoros) { //si usa questo perchè foreach non supporta funzioni asincrone
      const { studyTime, breakTime, cycles, completedCycles } = event.extendedProps.pomodoroSettings;
      
      // Convert minutes to time string "HH:mm"
      function minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      }


      const remainingCycles = cycles - completedCycles;
      nextDate.setDate(nextDate.getDate() + 2);

      const isSameDay = (date1, date2) => {
        return (
          date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getDate() === date2.getDate()
        );
      };
      
      const nextPomodorosOnDate = events.filter((event) =>
        event.extendedProps.isPomodoro && isSameDay(new Date(event.end), nextDate)
      );

      const start = new Date(nextDate); // Start with the current date
      start.setHours(new Date(event.start).getHours());   // Set hours
      start.setMinutes(new Date(event.start).getMinutes()); // Set minutes
      start.setSeconds(new Date(event.start).getSeconds()); // Set seconds
      start.setMilliseconds(0); // Ensure milliseconds are 0

      // Set end time based on duration from the original event
      const durationMs = new Date(event.end) - new Date(event.start); // Calculate duration
      const end = new Date(start.getTime() + durationMs);

      if (nextPomodorosOnDate.length === 0) { 
        const { _id, ...rest } = event;
        const newEvent = {
          ...rest,
          id: uuidv4(),
          title: event.title + ' - da recuperare', //prova
          start: start.toISOString(), 
          end: end.toISOString(), 
          extendedProps: {
            ...event.extendedProps,
            pomodoroSettings: {
              ...event.extendedProps.pomodoroSettings,
              cycles: remainingCycles, 
              completedCycles: 0,
            },
          },
        };
        await createNewEvent(newEvent, userID); 
        setEvents((prevEvents) => [...prevEvents, newEvent]);

      } else {

        for (const event of nextPomodorosOnDate) {
        const { studyTime: eventStudyTime, breakTime: eventBreakTime, cycles: eventCycles } = event.extendedProps.pomodoroSettings;

        const combinedStudyTime = Math.round(
            (studyTime * remainingCycles + eventStudyTime * eventCycles) /
            (remainingCycles + eventCycles)
        );

        const combinedBreakTime = Math.round(
            (breakTime * remainingCycles + eventBreakTime * eventCycles) /
            (remainingCycles + eventCycles)
        );

        const totalDuration = (combinedStudyTime + combinedBreakTime) * (remainingCycles + eventCycles);

        const updateOnDateEvent = {
            ...event,
            duration: minutesToTime(totalDuration),
            extendedProps: {
            ...event.extendedProps,
            pomodoroSettings: {
                studyTime: combinedStudyTime,
                breakTime: combinedBreakTime,
                cycles: remainingCycles + eventCycles,
                completedCycles: 0,
            },
            },
        };
        await updateEvent(updateOnDateEvent.id, updateOnDateEvent);
        }
      }

      const updatedPastEvent = { //metti completedcycles = cycles per eventi passati
        ...event,
        extendedProps: {
          ...event.extendedProps,
          pomodoroSettings: {
            ...event.extendedProps.pomodoroSettings,
            completedCycles: cycles,
          },
        },
      };

      await updateEvent(updatedPastEvent.id, updatedPastEvent);
    }

  } catch (error) {
    console.error("Errore durante la ridistribuzione dei pomodori:", error);
  }
};

export default redistributePomodoroTime;
