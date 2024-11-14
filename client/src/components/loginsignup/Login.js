import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div>
      <h1>Login</h1>
      {/* Aggiungi i campi per il login, per ora solo un link alla homepage */}
      <p>Non hai un account? <Link to="/signup">Registrati</Link></p>
      <p>Sei già registrato? <Link to="/home">Vai alla Homepage</Link></p>
    </div>
  );
};

export default Login;
