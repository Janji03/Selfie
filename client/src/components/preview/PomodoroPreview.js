import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserPomodoros } from '../../services/pomodoroService'

const PomodoroPreview = () => {
  const [lastPomodoro, setLastPomodoro] = useState(null);
  const userID =  localStorage.getItem("userID"); 

  useEffect(() => {


    const getLastPomodoro = async () => {
      try {
        const listaPomodoro = await getUserPomodoros(1, userID);
        if (listaPomodoro && listaPomodoro.length > 0) {
          setLastPomodoro(listaPomodoro[0]);//capisci se serve vettore o meno
        } else {
          setLastPomodoro(null);
        }
        console.log('Get pomodoro okay');
      } catch (error) {
        console.error('Get pomodoro non okay: ', error);
      }
    };

    getLastPomodoro();
  }, [userID]);

  return (
    <div>
      <h3>Preview Pomodoro</h3>
      <p>Rimani concentrato e traccia il tuo tempo.</p>
      {lastPomodoro ? (
        <div>
          <p><strong>Study Time:</strong> {lastPomodoro.studyTime} minuti</p>
          <p><strong>Break Time:</strong> {lastPomodoro.breakTime} minuti</p>
          <p><strong>Cycles:</strong> {lastPomodoro.cycles}</p>
        </div>
      ) : (
        <p>Non trovato ultimo pomodoro</p>
      )}
      <Link to="/pomodoro">Vai al Pomodoro</Link>
    </div>
  );
};

export default PomodoroPreview;
