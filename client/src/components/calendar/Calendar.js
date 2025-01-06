import React, { useEffect, useState, useRef, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
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

import redistributePomodoroTime from "./events/EventPomodoroRedistribution"

import { getEvents } from "../../services/eventService";
import { getTasks } from "../../services/taskService";

import DateUtilities from "./DateUtilities";

const Calendar = () => {
  const calendarRef = useRef(null);

  const { isAuthenticated } = useContext(AuthContext);
  const userID = localStorage.getItem("userID");

  const isInitialMount = useRef(true);
  const [calendarRenderKey, setCalendarRenderKey] = useState(0);

  const { time, isTimeMachineActive } = useTimeMachine();

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

  const [selectedOccurrence, setSelectedOccurrence] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);

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

      const fetchAndRedistributeEvents = async () => {
        try {
          await redistributePomodoroTime(userID, time, setEvents);
        } catch (error) {
          console.error("Error during redistribution:", error);
        }
      };
      
      fetchAndRedistributeEvents();
      fetchEventsAndTasks();

    }
  }, [isAuthenticated, userID]);

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
    checkForOverdueTasks,
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
    time,
    isTimeMachineActive,
    calendarTimeZone,
  });

  const { decrementOneDay, roundTime } = DateUtilities({ calendarTimeZone });

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    checkForOverdueTasks();
    handleTriggerReRender();
  }, [isTimeMachineActive]);

  const handleTriggerReRender = () => {
    setCalendarRenderKey((prevKey) => prevKey + 1);
  };

  // boh non ho idea se funzioni
  useEffect(() => {
    let intervalId;

    const checkForOverdueTasksAtMidnight = async () => {
      console.log("Checking for overdue tasks at midnight...");
      await checkForOverdueTasks();
    };

    const now = new Date();
    const millisTillMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) -
      now;

    const timeoutId = setTimeout(async () => {
      await checkForOverdueTasksAtMidnight();

      intervalId = setInterval(() => {
        checkForOverdueTasksAtMidnight();
      }, 24 * 60 * 60 * 1000);
    }, millisTillMidnight);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (currentView === "eventList") {
      setCombinedEvents(events);
    } else if (currentView === "taskList") {
      setCombinedEvents(tasks);
    } else {
      const combined = [...events, ...tasks];
      setCombinedEvents(combined);
    }
    handleTriggerReRender();
  }, [events, tasks, currentView]);

  const handleViewChange = ({ view }) => {
    if (view.type === "eventList" || view.type === "taskList") {
      setCombinedEvents(view.type === "eventList" ? events : tasks);
    } else {
      setCombinedEvents([...events, ...tasks]);
    }
    setCurrentView(view.type);
  };

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
    if (clickedItemType === "event") {
      setCurrentFormTab("event");
      handleEventClick(info, clickedItemId);
    } else {
      setCurrentFormTab("task");
      handleTaskClick(clickedItemId);
    }
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
    setCurrentFormTab("event");
    const calendarApi = calendarRef.current.getApi();
    const view = calendarApi.view;

    let baseDate;
    let startDateTime;

    if (
      view.type === "timeGridDay" ||
      view.type === "timeGridWeek" ||
      view.type === "eventList" ||
      view.type === "taskList"
    ) {
      baseDate = new Date(view.currentStart);
    } else {
      baseDate = new Date(time);
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

  const isEventEditing = selectedEvent !== null;
  const isTaskEditing = selectedTask !== null;

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
      <TimeMachinePreview />

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          if (isTaskEditing) setCurrentFormTab("task");
          else if (isEventEditing) setCurrentFormTab("event");
        }}
        title={currentFormTab === "event" ? "Event" : "Task"}
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
        title={"Event"}
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
        title={"Task"}
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
        key={calendarRenderKey}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          interactionPlugin,
          rrulePlugin,
          luxonPlugin,
        ]}
        initialView={currentView}
        headerToolbar={{
          left: "today prev,next addEventButton",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay eventList,taskList",
        }}
        customButtons={{
          addEventButton: {
            text: "+",
            click: handleAddItem,
          },
        }}
        views={{
          eventList: {
            type: "list",
            duration: { month: 1 },
            buttonText: "Event List",
          },
          taskList: {
            type: "list",
            duration: { month: 1 },
            buttonText: "Task List",
          },
        }}
        events={combinedEvents}
        timeZone={calendarTimeZone}
        now={time}
        nowIndicator={true}
        datesSet={handleViewChange}
        dateClick={handleDateClick}
        eventClick={handleItemClick}
        selectable={true}
        select={handleSelectRange}
      />
    </div>
  );
};

export default Calendar;
