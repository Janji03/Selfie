import React, { useState } from 'react';
import { createPomodoro } from '../../services/pomodoroService';

const Pomodoro = () => {
  const [studyTime, setStudyTime] = useState(30);
  const [breakTime, setBreakTime] = useState(5);
  const [cycles, setCycles] = useState(5);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [proposals, setProposals] = useState([])


  const handleSubmit = () => {

  };


  const handleTotalMinutesChange = (e) => {
    setTotalMinutes(e.target.value)
    if(totalMinutes > 0) {
      calculateProposals()
    }
    else {
      setProposals([])
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



  return (
    <div>
    <h1>Pomodoro Timer</h1>

    <form id="study-form" onSubmit={handleSubmit}>
      <label htmlFor="total-time">Tempo complessivo di studio (minuti):</label>
      <input type="number" id="total-time" required onChange={handleTotalMinutesChange} />

      <label htmlFor="study-time">Tempo singolo di studio (minuti):</label>
      <input type="number" id="study-time" required onChange={setStudyTime(e.target.value)} />

      <label htmlFor="break-time">Tempo singolo di pausa (minuti):</label>
      <input type="number" id="break-time" required onChange={setBreakTime(e.target.value)} />

      <label htmlFor="cycles">Cicli:</label>
      <input type="number" id="cycles" required  onChange={setCycles(e.target.value)}/>

      <button type="submit" >Inizia Sessione</button>
    </form>


      <h1>Timer:</h1>
  </div>
);
};
export default Pomodoro;
