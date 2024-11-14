import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/loginsignup/Login';
import Signup from './components/loginsignup/Signup';
import HomePage from './components/homepage/Homepage';
import Calendar from './components/calendar/Calendar';
import Pomodoro from './components/pomodoro/Pomodoro';
import Notes from './components/notes/Notes';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
