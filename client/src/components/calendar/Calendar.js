import React, { useEffect, useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import TimeMachinePreview from '../preview/TimeMachinePreview';
import { useTimeMachine } from '../../context/TimeMachineContext';

const Calendar = () => {

  const { time } = useTimeMachine(); 
  const [currentTime, setCurrentTime] = useState(time);

  useEffect(() => {
    setCurrentTime(time);
  }, [time]);

  const handleDateClick = (info) => {
    alert(`Date clicked: ${info.dateStr}`);
  };

  return (
    <div>
      <TimeMachinePreview />
      <FullCalendar
        key={currentTime.getTime()}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        editable={true}
        events={[]}
        dateClick={handleDateClick}
        now={currentTime}
        nowIndicator={true}
      />
    </div>
  );
};

export default Calendar;