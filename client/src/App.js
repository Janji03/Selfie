import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/loginsignup/Login';
import Signup from './components/loginsignup/Signup';
import HomePage from './components/homepage/Homepage';
import Profile from './components/profile/Profile';
import Calendar from './components/calendar/Calendar';
import Pomodoro from './components/pomodoro/Pomodoro';
import Notes from './components/notes/Notes';
import ProtectedRoute from './components/loginsignup/ProtectedRoute';
import ForgotPassword from './components/loginsignup/ForgotPassword'; // Import nuovo componente
import ResetPassword from './components/loginsignup/ResetPassword'; // Import nuovo componente

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/pomodoro" element={<ProtectedRoute><Pomodoro /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Nuova route */}
          <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Nuova route */}
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
