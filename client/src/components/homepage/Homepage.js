import React from 'react';
import Calendarpreview from '../preview/Calendarpreview';
import Pomodoropreview from '../preview/Pomodoropreview';
import Notespreview from '../preview/Notespreview';

const Homepage = () => {
  return (
    <div>
      <h1>Homepage</h1>
      <div>
        <Calendarpreview />
        <Pomodoropreview />
        <Notespreview />
      </div>
    </div>
  );
};

export default Homepage;
