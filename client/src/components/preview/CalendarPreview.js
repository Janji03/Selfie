import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid"; 
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { AuthContext } from "../../context/AuthContext";
import { useTimeMachine } from "../../context/TimeMachineContext";

import { getEvents } from "../../services/eventService";
import { getTasks } from "../../services/taskService";

import TaskHandler from "../calendar/tasks/TaskHandler";

import "../../styles/Preview.css";

const CalendarPreview = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useContext(AuthContext);
  const userID = localStorage.getItem("userID");

  const { time, isTimeMachineActive } = useTimeMachine();

  const [calendarRenderKey, setCalendarRenderKey] = useState(0);
  const [currentView, setCurrentView] = useState("dayGridMonth");

  const [tasks, setTasks] = useState([]);
  const [combined, setCombined] = useState([]);

  const {
    checkForOverdueTasks,
  } = TaskHandler({
    userID,
    tasks,
    setTasks,
    time,
    isTimeMachineActive,
  });

  useEffect(() => {
    if (isAuthenticated) {
      const fetchEventsAndTasks = async () => {
        try {
          const fetchedEvents = await getEvents(userID);
          const fetchedTasks = await getTasks(userID);
          setTasks(fetchedTasks);

          const combinedItems =[...fetchedEvents, ...fetchedTasks];
          setCombined(combinedItems);
        } catch (error) {
          console.error("Error fetching events or tasks:", error);
        }
      };
      fetchEventsAndTasks();
    }
  }, [isAuthenticated, userID, isTimeMachineActive]); 

  useEffect(() => {  
      checkForOverdueTasks();
      handleTriggerReRender();
  }, [isTimeMachineActive]);

  const handleTriggerReRender = () => {
    setCalendarRenderKey((prevKey) => prevKey + 1);
  };

  const goToCalendar = () => {
    navigate("/calendar");
  };

  const handleViewChange = (e) => {
    handleTriggerReRender();
    setCurrentView(e.target.value);
  };

  return (
    <div className="calendar-preview">
      <div className="view-select">
        <label htmlFor="view-select">Seleziona vista:</label>
        <select id="view-select" value={currentView} onChange={handleViewChange}>
          <option value="dayGridMonth">Vista Mensile</option>
          <option value="timeGridWeek">Vista Settimanale</option>
          <option value="timeGridDay">Vista Giornaliera</option>
        </select>
      </div>


      <FullCalendar
        key={calendarRenderKey}
        plugins={[listPlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]} 
        initialView={currentView} 
        headerToolbar={{
          left: "",
          center: "title",
          right: "",
        }}
        selectable={true}
        events={combined}
        eventClick={goToCalendar}
        dateClick={goToCalendar}
        height="auto"
        now={time}
        dayMaxEventRows={1}
      />

      <Link to="/calendar" className="calendar-link">
        Vai al Calendario
      </Link>
    </div>
  );
};

export default CalendarPreview;
