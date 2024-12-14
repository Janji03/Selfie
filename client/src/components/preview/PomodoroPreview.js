import React from 'react';
import { Link } from 'react-router-dom';

const PomodoroPreview = () => {
  return (
    <div>
      <h3>Preview Pomodoro</h3>
      <p>Rimani concentrato e traccia il tuo tempo.</p>
      <Link to="/pomodoro">Vai al Pomodoro</Link>
    </div>
  );
};

export default PomodoroPreview;
