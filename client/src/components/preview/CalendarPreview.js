import React from 'react';
import { Link } from 'react-router-dom';

const CalendarPreview = () => {
  return (
    <div>
      <h3>Preview Calendario</h3>
      <p>Gestisci i tuoi impegni e pianifica le attività.</p>
      <Link to="/calendar">Vai al Calendario</Link>
    </div>
  );
};

export default CalendarPreview;
