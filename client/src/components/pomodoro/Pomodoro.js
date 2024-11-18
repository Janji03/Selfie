import React, { useEffect, useState } from 'react';
import { createPomodoro } from '../../services/pomodoroService';

const Pomodoro = () => {
  const [studyTime, setStudyTime] = useState(30);
  const [breakTime, setBreakTime] = useState(5);
  const [cycles, setCycles] = useState(5);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [proposals, setProposals] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)


  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('inizio ciclo di studio')
    setIsRunning(true)
    setTimeLeft(studyTime * 60)

    const pomodoroData = {
      studyTime,
      breakTime,
      cycles,
    };

    try {
      await createPomodoro(pomodoroData);
      console.log('Pomodoro salvato correttamente');
    } catch (error) {
      console.error('Errore: ', error);
    }
  };


  const handleTotalMinutesChange = (e) => {
    setTotalMinutes(e.target.value)
    if(totalMinutes > 0) {
      //calculateProposals()
    }
    else {
      //setProposals([])
    }
  };

  const calculateProposals = () => {
    const breakTime = Math.floor(totalMinutes * 0.2);
    const studyTime = totalMinutes - breakTime;
    return [
      { study: studyTime, break: breakTime, cycles: 1 },
      { study: Math.floor(studyTime / 2), break: breakTime, cycles: 2 },
      { study: Math.floor(studyTime / 3), break: breakTime, cycles: 3 },
    ];
  }


  const convertTime = () => {
      const seconds = studyTime * 60 ; 
      const minutes = Math.floor(seconds / 60);
      const remainderSeconds = seconds % 60;
      return `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    };


    useEffect(() => {
      if (isRunning && timeLeft > 0) {

        const interval = setInterval(() => {
          setTimeLeft((timeLeft) => timeLeft - 1);
        }, 1000);
  
        clearInterval(interval);
      } else if (timeLeft === 0) {
        alert('fine ciclo di studio')
        setIsRunning(false); 
      }
    }, [isRunning, timeLeft]);


  return (
    <div>
    <h1>Pomodoro Timer</h1>

    <form id="study-form" onSubmit={handleSubmit}>
      <label htmlFor="total-time">Tempo complessivo di studio (minuti):</label>
      <input type="number" id="total-time" required onChange={handleTotalMinutesChange} />

      <label htmlFor="study-time">Tempo singolo di studio (minuti):</label>
      <input type="number" id="study-time" required onChange={(e) => setStudyTime(e.target.value)} />

      <label htmlFor="break-time">Tempo singolo di pausa (minuti):</label>
      <input type="number" id="break-time" required onChange={(e) => setBreakTime(e.target.value)} />

      <label htmlFor="cycles">Cicli:</label>
      <input type="number" id="cycles" required  onChange={(e) => setCycles(e.target.value)}/>

      <button type="submit" >Inizia Sessione</button>
    </form>


      <h1>Timer:{convertTime()}</h1>
  </div>
);
};
export default Pomodoro;
