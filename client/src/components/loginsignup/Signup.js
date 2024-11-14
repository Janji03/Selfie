import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div>
      <h1>Signup</h1>
      {/* Aggiungi i campi per il signup, per ora solo un link alla homepage */}
      <p>Hai già un account? <Link to="/login">Accedi</Link></p>
      <p>Registrato? <Link to="/home">Vai alla Homepage</Link></p>
    </div>
  );
};

export default Signup;
