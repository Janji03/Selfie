import React from 'react';
import ProfilePreview from '../preview/ProfilePreview';
import CalendarPreview from '../preview/CalendarPreview';
import PomodoroPreview from '../preview/PomodoroPreview';
import NotesPreview from '../preview/NotesPreview';
import TimeMachinePreview from '../preview/TimeMachinePreview';

const Homepage = () => {
  return (
    <div>
      <h1>Homepage</h1>
      <div>
        <ProfilePreview />
        <CalendarPreview />
        <PomodoroPreview />
        <NotesPreview />
        <TimeMachinePreview />
      </div>
    </div>
  );
};

export default Homepage;
