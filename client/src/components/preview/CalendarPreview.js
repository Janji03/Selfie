import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";

import { AuthContext } from "../../context/AuthContext";
import { useTimeMachine } from "../../context/TimeMachineContext";

import { getEvents } from "../../services/eventService";
import { getTasks } from "../../services/taskService";

import TaskHandler from "../calendar/tasks/TaskHandler";

const CalendarPreview = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useContext(AuthContext);
  const userID = localStorage.getItem("userID");

  const { time, isTimeMachineActive } = useTimeMachine();

  const [calendarRenderKey, setCalendarRenderKey] = useState(0);

  const [tasks, setTasks] = useState([]);
  const [previewCombined, setPreviewCombined] = useState([]);

  const {
    checkForOverdueTasks,
  } = TaskHandler({
    userID,
    tasks,
    setTasks,
    time,
    isTimeMachineActive,
  });

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const filterTodayItems = (items) => {
    const currentDate = formatDate(new Date(time)); 

    return items.filter((item) => {
      const startDate = formatDate(new Date(item.start));
      const endDate = formatDate(new Date(item.end || item.start)); 

      return currentDate >= startDate && currentDate <= endDate;
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchEventsAndTasks = async () => {
        try {
          const fetchedEvents = await getEvents(userID);
          const fetchedTasks = await getTasks(userID);
          setTasks(fetchedTasks);

          const combined = filterTodayItems([...fetchedEvents, ...fetchedTasks]);
          setPreviewCombined(combined);
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

  const handleEventClick = () => {
    navigate("/calendar");
  };

  return (
    <div className="calendar-preview">
      {previewCombined.length > 0 ? (
        <FullCalendar
          key={calendarRenderKey}
          plugins={[listPlugin]}
          initialView="listDay"
          headerToolbar={{
            left: "",
            center: "title",
            right: "",
          }}
          events={previewCombined}
          eventClick={handleEventClick}
          height="auto"
          now={time}
        />
      ) : (
        <p>Non hai programmato eventi/task oggi.</p>
      )}

      <Link to="/calendar" className="calendar-link">
        Vai al Calendario
      </Link>
    </div>
  );
};

export default CalendarPreview;
