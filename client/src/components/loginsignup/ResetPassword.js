import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/authService';

const ResetPassword = () => {
  const { token } = useParams(); // Recupera il token dalla URL
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await resetPassword(token, password);
      setMessage(response.message); // Messaggio di successo dal backend
      setTimeout(() => navigate('/login'), 3000); // Redireziona al login dopo 3 secondi
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Resetta Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Inserisci la nuova password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Aggiorna Password</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ResetPassword;
