import { getEvents, updateEvent, createEvent } from "../../../services/eventService";

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

    const updatedEvents = [];
    let nextDate = new Date(currentDate);


    for (const event of uncompletedPomodoros) { //si usa questo perchè foreach non supporta funzioni asincrone
      const { studyTime, breakTime, cycles, completedCycles } = event.extendedProps.pomodoroSettings;

      const remainingCycles = cycles - completedCycles;

      nextDate.setDate(nextDate.getDate() + 2); //aggiorna data 

      const nextPomodorosOnDate = events.filter((event) => { //returna i pomodori in data nextdate
        return (
          event.extendedProps.isPomodoro &&
          new Date(event.end).getTime() === new Date(nextDate).getTime()  //new per averla in formato adatto a js
        );
      });

      if (!nextPomodorosOnDate) { 

        const newEvent = {
          ...event,
          start: nextDate.toISOString(),
          end: nextDate.toISOString(),
          duration: ((studyTime + breakTime)*remainingCycles),
          extendedProps: {
            ...event.extendedProps,
            pomodoroSettings: {
              ...event.extendedProps.pomodoroSettings,
              cycles: remainingCycles, 
              completedCycles: 0,
            },
          },
        };

        updatedEvents.push(newEvent); //pusha evento nel vettore

      } else {
        const pomodorosOnDateLength = nextPomodorosOnDate.length;

        for (const event of nextPomodorosOnDate) {
        const { studyTime: eventStudyTime, breakTime: eventBreakTime, cycles: eventCycles } = event.extendedProps.pomodoroSettings;

        const combinedStudyTime = Math.floor(
            (studyTime * remainingCycles + eventStudyTime * eventCycles) /
            (remainingCycles + eventCycles)
        );

        const combinedBreakTime = Math.floor(
            (breakTime * remainingCycles + eventBreakTime * eventCycles) /
            (remainingCycles + eventCycles)
        );

        const updateOnDateEvent = {
            ...event,
            duration: Math.floor(((studyTime + breakTime) * remainingCycles) / pomodorosOnDateLength) + event.duration,
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

    for (const newEvent of updatedEvents) {
      await createEvent(newEvent, userID);
    }

    setEvents((prevEvents) => [...prevEvents, ...updatedEvents]);
  } catch (error) {
    console.error("Errore durante la ridistribuzione dei pomodori:", error);
  }
};

export default redistributePomodoroTime;
