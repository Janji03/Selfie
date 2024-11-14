import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Homepage</h1>
      <nav>
        <ul>
          <li><Link to="/calendar">Calendario</Link></li>
          <li><Link to="/pomodoro">Pomodoro</Link></li>
          <li><Link to="/notes">Note</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;
