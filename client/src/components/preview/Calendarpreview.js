import React from 'react';
import { Link } from 'react-router-dom';

const Calendariopreview = () => {
  return (
    <div>
      <h3>Calendario</h3>
      <p>Gestisci i tuoi impegni e pianifica le attività.</p>
      <Link to="/calendar">Vai al Calendario</Link>
    </div>
  );
};

export default Calendariopreview;
