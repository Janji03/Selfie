import { getEvents, updateEvent, createNewEvent } from "../../../services/eventService";
import { v4 as uuidv4 } from "uuid";

const redistributePomodoroTime = async (userID, currentDate) => {
  try {
    //Elenco eventi
    const events = await getEvents(userID); 
    
    //Lista pomodori non completati
    const uncompletedPomodoros = events.filter((event) => { 
      const { completedCycles, cycles } = event.extendedProps.pomodoroSettings || {};
      return (
        event.extendedProps.isPomodoro &&
        completedCycles < cycles &&
        new Date(event.end) < new Date(currentDate)                       //new per averla in formato adatto a js
      );
    });

    console.log(uncompletedPomodoros,'pomodori non completati')

    let nextDate = new Date(currentDate);

    for (const event of uncompletedPomodoros) {                           //si usa questo perchè foreach non supporta funzioni asincrone
      const { studyTime, breakTime, cycles, completedCycles } = event.extendedProps.pomodoroSettings;
      
      // Converti minuti in "HH:mm"
      function minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      }

      //decrementa il numero di cicli se pomodoro parzialmente completato
      const remainingCycles = cycles - completedCycles;
      nextDate.setDate(nextDate.getDate() + 2);

      const isSameDay = (date1, date2) => {
        return (
          date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getDate() === date2.getDate()
        );
      };
      
      //Lista con i pomodori già esistenti nella data dove dovrebbero essere sostituiti
      const nextPomodorosOnDate = events.filter((event) =>
        event.extendedProps.isPomodoro && isSameDay(new Date(event.end), nextDate)
      );

      const start = new Date(nextDate); 
      start.setHours(new Date(event.start).getHours());   
      start.setMinutes(new Date(event.start).getMinutes()); 
      start.setSeconds(new Date(event.start).getSeconds()); 
      start.setMilliseconds(0);

      
      const durationMs = new Date(event.end) - new Date(event.start);
      const end = new Date(start.getTime() + durationMs);

      //Se non ci sono pomodori nella data stabilita creane uno nuovo
      if (nextPomodorosOnDate.length === 0) { 
        const { _id, ...rest } = event;
        const newEvent = {
          ...rest,
          id: uuidv4(),
          title: event.title + ' - da recuperare',
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

      } else {

        //Se esistono pomodori nella data stabilita suddividi il pomodoro da recuperare e aggiungilo a questi
        for (const event of nextPomodorosOnDate) {
        const { studyTime: eventStudyTime, breakTime: eventBreakTime, cycles: eventCycles } = event.extendedProps.pomodoroSettings;

        const combinedStudyTime = Math.round(
            ((studyTime/nextPomodorosOnDate.length) * remainingCycles + eventStudyTime * eventCycles) /
            (remainingCycles + eventCycles)
        );

        const combinedBreakTime = Math.round(
            ((breakTime/nextPomodorosOnDate.length) * remainingCycles + eventBreakTime * eventCycles) /
            (remainingCycles + eventCycles)
        );

        const totalDuration = (combinedStudyTime + combinedBreakTime) * (remainingCycles + eventCycles);

        const startDate = new Date(event.start);

        const newEndDate = new Date(startDate.getTime() + totalDuration * 60 * 1000);

        const updateOnDateEvent = {
            ...event,
            title: event.title + ' - aggiunto recupero',
            duration: minutesToTime(totalDuration),
            end: newEndDate.toISOString(),
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

      const updatedPastEvent = { 
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
