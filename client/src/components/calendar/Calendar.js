import React, { useEffect, useState, useRef, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import luxonPlugin from "@fullcalendar/luxon";

import { AuthContext } from "../../context/AuthContext";

import TimeMachinePreview from "../preview/TimeMachinePreview";
import { useTimeMachine } from "../../context/TimeMachineContext";

import Modal from "../common/Modal";

import TabSwitcher from "./TabSwitcher";

import EventForm from "./events/EventForm";
import TaskForm from "./tasks/TaskForm";

import EventHandler from "./events/EventHandler";
import TaskHandler from "./tasks/TaskHandler";

import EventInfo from "./events/EventInfo";
import TaskInfo from "./tasks/TaskInfo";

import { getEvents } from "../../services/eventService";
import { getTasks } from "../../services/taskService";

import DateUtilities from "./DateUtilities";


const Calendar = () => {
  const calendarRef = useRef(null);

  const { isAuthenticated } = useContext(AuthContext);
  const userID = localStorage.getItem("userID");

  const { time } = useTimeMachine(); 
  const [currentTime, setCurrentTime] = useState(time);
  const [isTimeUpdated, setIsTimeUpdated] = useState(false); 

  const [calendarTimeZone, setCalendarTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const [currentView, setCurrentView] = useState("dayGridMonth");

  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [combinedEvents, setCombinedEvents] = useState([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFormTab, setCurrentFormTab] = useState("event");

  const [eventFormInitialData, setEventFormInitialData] = useState({});
  const [taskFormInitialData, setTaskFormInitialData] = useState({});

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const isEventEditing = selectedEvent !== null;
  const isTaskEditing = selectedTask !== null;

  const [selectedOccurrence, setSelectedOccurrence] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);


  const {
    handleEventClick,
    handleEditEvent,
    handleDeleteEvent,
    handleEventFormSubmit,
    initializeEventForm,
  } = EventHandler({
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
  });

  const {
    handleTaskClick,
    handleEditTask,
    handleDeleteTask,
    handleTaskFormSubmit,
    initializeTaskForm,
    markTaskAsCompleted,
    checkForOverdueTasks
  } = TaskHandler({
    userID,
    tasks,
    setTasks,
    selectedTask,
    setSelectedTask,
    isEditMode,
    setIsEditMode,
    setIsFormOpen,
    setTaskFormInitialData,
    currentTime,
    calendarTimeZone,
  });

  const { decrementOneDay, roundTime } = DateUtilities({ calendarTimeZone });

  useEffect(() => {
    setCurrentTime(time); 
    setIsTimeUpdated(false);
  }, [time]);

  const handleTimeUpdate = () => {
    setIsTimeUpdated(true);
  };

  useEffect(() => {
    if (isAuthenticated) {
      
      const fetchEventsAndTasks = async () => {
        try {
          const fetchedEvents = await getEvents(userID);
          const fetchedTasks = await getTasks(userID);
          setEvents(fetchedEvents);
          setTasks(fetchedTasks);
          const combined = [...fetchedEvents, ...fetchedTasks];
          setCombinedEvents(combined);
        } catch (error) {
          console.error("Error fetching events or tasks:", error);
        }
      };
      fetchEventsAndTasks();
    }
  }, [isAuthenticated, userID]);

  useEffect(() => {
    const combined = [...events, ...tasks];
    setCombinedEvents(combined);
  }, [events, tasks]);

  useEffect(() => {
    const checkForOverdueTasksAtMidnight = async () => {
      await checkForOverdueTasks();  
    };
    
    const now = new Date(currentTime);
    const millisTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;
  
    const timeoutId = setTimeout(() => {
      checkForOverdueTasksAtMidnight();
  
      const intervalId = setInterval(() => {
        checkForOverdueTasksAtMidnight();
      }, 24 * 60 * 60 * 1000);
  
      return () => clearInterval(intervalId); 
    }, millisTillMidnight);
  
    return () => clearTimeout(timeoutId);
  }, [tasks, checkForOverdueTasks]);

  useEffect(() => {
    checkForOverdueTasks();
  }, [isTimeUpdated]);

  const handleDateClick = (info) => {
    const startDateTime = info.dateStr;

    initializeEventForm(startDateTime);
    initializeTaskForm(startDateTime);

    if (info.allDay) {
      setEventFormInitialData((prevData) => ({
        ...prevData,
        allDay: true,
      }));
      setTaskFormInitialData((prevData) => ({
        ...prevData,
        allDay: true,
      }));
    }

    setSelectedEvent(null);
    setSelectedTask(null);

    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleItemClick = async (info) => {
    setIsFormOpen(false);
    const clickedItemType = info.event._def.extendedProps.itemType;
    const clickedItemId = info.event._def.publicId;
    clickedItemType === "event"
      ? handleEventClick(info, clickedItemId)
      : handleTaskClick(clickedItemId);
  };

  const handleSelectRange = (info) => {
    let startDateTime = info.startStr;
    let endDateTime = info.endStr;

    let allday = info.allDay;
    if (info.allDay) {
      startDateTime = startDateTime += "T00:00:00";
      decrementOneDay(endDateTime);
      allday = true;
    }

    setSelectedRange({
      start: startDateTime,
      end: endDateTime,
      allDay: allday,
    });
  };

  const handleAddItem = () => {
    const calendarApi = calendarRef.current.getApi();
    const view = calendarApi.view;

    let baseDate;
    let startDateTime;

    if (
      view.type === "timeGridDay" ||
      view.type === "timeGridWeek" ||
      view.type === "listWeek"
    ) {
      baseDate = new Date(view.currentStart);
    } else {
      baseDate = new Date(currentTime);
    }

    if (selectedRange) {
      initializeEventForm(selectedRange.start);
      initializeTaskForm(selectedRange.start);
      if (selectedRange.allDay) {
        setEventFormInitialData((prevData) => ({
          ...prevData,
          endDate: decrementOneDay(selectedRange.end),
          allDay: true,
        }));
        setTaskFormInitialData((prevData) => ({
          ...prevData,
          allDay: true,
        }));
      } else {
        setEventFormInitialData((prevData) => ({
          ...prevData,
          endDate: selectedRange.end.split("T")[0],
          endTime: selectedRange.end.split("T")[1].slice(0, 5),
        }));
      }
    } else {
      baseDate.setHours(new Date().getHours());
      startDateTime = roundTime(baseDate).toISOString();
      initializeEventForm(startDateTime);
      initializeTaskForm(startDateTime);
    }

    setIsEditMode(false);
    setIsFormOpen(true);
    setSelectedRange(null);
  };

  const renderForm = () => {
    if (currentFormTab === "event") {
      return (
        <EventForm
          initialData={eventFormInitialData}
          onSubmit={handleEventFormSubmit}
          isEditMode={isEditMode}
        />
      );
    } else {
      return (
        <div>
          <TaskForm
            initialData={taskFormInitialData}
            onSubmit={handleTaskFormSubmit}
            isEditMode={isEditMode}
          />
        </div>
      );
    }
  };

  return (
    <div>
      <TimeMachinePreview onTimeUpdate={handleTimeUpdate} />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={currentFormTab === 'event' ? 'Event' : 'Task'}
        zIndex={1100}
      >
        <TabSwitcher
          currentFormTab={currentFormTab}
          setCurrentFormTab={setCurrentFormTab}
          disableEventTab={isTaskEditing}  
          disableTaskTab={isEventEditing}
        />
        {renderForm()}
      </Modal>

      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={'Event'}
        zIndex={1000}
      >
        {selectedEvent && (
          <EventInfo
            selectedEvent={selectedEvent}
            selectedOccurrence={selectedOccurrence}
            handleEditEvent={handleEditEvent}
            handleDeleteEvent={handleDeleteEvent}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={'Task'}
        zIndex={1000}
      >
        {selectedTask && (
          <TaskInfo
            selectedTask={selectedTask}
            handleEditTask={handleEditTask}
            handleDeleteTask={handleDeleteTask}
            markTaskAsCompleted={() => markTaskAsCompleted(selectedTask.id)}
          />
        )}
      </Modal>

      <FullCalendar
        ref={calendarRef}
        key={isTimeUpdated ? currentTime.getTime() : 'static'} 
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin, luxonPlugin]}
        initialView={currentView}
        headerToolbar={{
          left: 'today prev,next addEventButton',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        customButtons={{
          addEventButton: {
            text: "+",
            click: handleAddItem,
          },
        }}
        events={combinedEvents}
        timeZone={calendarTimeZone}
        now={currentTime} 
        nowIndicator={true}
        viewDidMount={({ view }) => {
          setCurrentView(view.type);
        }}
        dateClick={handleDateClick}
        eventClick={handleItemClick}
        selectable={true}
        select={handleSelectRange}
      />
    </div>
  );
};

export default Calendar;