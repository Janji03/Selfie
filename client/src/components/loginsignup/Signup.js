import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/Auth.css'; 

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login: authenticate } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await signup({ name, email, password });
      localStorage.setItem('token', response.token); 
      localStorage.setItem('userID', response.userID);
      authenticate(response.token, response.userID);
      navigate('/home'); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <div className="data">
          <label>Nome</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="data">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="data">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div className="btn">
          <div className="inner"></div>
          <button type="submit">Registrati</button>
        </div>
      </form>
      {error && <p>{error}</p>}
      <p className="signup-link">Hai già un account? <a href="/login">Accedi</a></p>
    </div>
  );
};

export default Signup;
