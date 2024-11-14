import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  // Funzione per inviare la richiesta al backend
  const sendRequest = () => {
    fetch('/test') // Questo è l'endpoint che il server Express gestirà
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => {
        console.error('Errore nella richiesta:', error);
        setMessage('Si è verificato un errore');
      });
  };

  return (
    <div className="App">
      <h1>{message}</h1>
      <button onClick={sendRequest}>Invia richiesta al backend</button>
    </div>
  );
}

export default App;
