import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";

import { AuthContext } from "../../context/AuthContext";
import { useTimeMachine } from "../../context/TimeMachineContext";

import { getEvents } from "../../services/eventService";
import { getTasks } from "../../services/taskService";

const CalendarPreview = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useContext(AuthContext);
  const userID = localStorage.getItem("userID");

  const { time, isTimeMachineActive } = useTimeMachine();

  const [calendarRenderKey, setCalendarRenderKey] = useState(0);

  const [previewCombined, setPreviewCombined] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      
      const fetchEventsAndTasks = async () => {
        try {
          const fetchedEvents = await getEvents(userID);
          const fetchedTasks = await getTasks(userID);
          const combined = [...fetchedEvents, ...fetchedTasks];
          setPreviewCombined(combined);
        } catch (error) {
          console.error("Error fetching events or tasks:", error);
        }
      };
      fetchEventsAndTasks();
    }
  }, [isAuthenticated, userID]);

  useEffect(() => {
    handleTriggerReRender(); 
  }, [isTimeMachineActive]);

  const handleTriggerReRender = () => {
    setCalendarRenderKey((prevKey) => prevKey + 1);
  };

  const handleEventClick = () => {
    navigate("/calendar");
  };

  return (
    <div>
      <h3>Preview Calendario</h3>
      <FullCalendar
        key={calendarRenderKey}
        plugins={[listPlugin]} 
        initialView="listDay" 
        headerToolbar={false} 
        events={previewCombined} 
        eventClick={handleEventClick} 
        height="auto" 
        now={time}
      />
    </div>
  );
};

export default CalendarPreview;