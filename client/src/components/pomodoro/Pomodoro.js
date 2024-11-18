import React, { useEffect, useState } from 'react';
import { createPomodoro } from '../../services/pomodoroService';

const Pomodoro = () => {
  const [studyTime, setStudyTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [resetCycles, setResetCycles] = useState(5);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [onBreak, setOnBreak] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('inizio ciclo di studio')
    setTimeLeft(studyTime * 60)
    setResetCycles(cycles)
    setIsRunning(true)
    setOnBreak(false)


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



  const calculateProposals = () => {
    const breakTime = Math.floor(totalMinutes * 0.2);
    const studyTime = totalMinutes - breakTime;
    return [
      { study: studyTime, break: breakTime, cycles: 1 },
      { study: Math.floor(studyTime / 2), break: breakTime, cycles: 2 },
      { study: Math.floor(studyTime / 3), break: breakTime, cycles: 3 },
    ];
  }

//converte numeri normali in tempo
  const convertTime = () => {
      const seconds = timeLeft; 
      const minutes = Math.floor(seconds / 60);
      const remainderSeconds = seconds % 60;
      return `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    };


    useEffect(() => {
      if (isRunning) {
        if (timeLeft > 0) {
          const interval = setInterval(() => {//fa andare il timer
            setTimeLeft((prevTime) => prevTime - 1);
          }, 20);
    
          return () => clearInterval(interval);
        } else if (timeLeft === 0) {
          if (cycles > 0) {
            setOnBreak(!onBreak); //se falsa sta per iniziare studytime, se vera sta per iniziare break 
            if(!onBreak){ 
              setCycles((prevCycles) => prevCycles - 1); //riduci cicli
              setTimeLeft(breakTime * 60); //pausa
            } else {
              setTimeLeft(studyTime * 60);
            }
            
          } else { //se finiti cicli e tempo = 0
            alert('Fine ciclo di studio');
            setIsRunning(false);
            setCycles(resetCycles)
          }
        }
      }
    }, [isRunning, timeLeft]);
    


  return (
    <div>
    <h1>Pomodoro Timer</h1>

    <form id="study-form">
      <label htmlFor="total-time">Tempo complessivo di studio (minuti):</label>
      <input type="number" id="total-time" required onChange={(e) => setTotalMinutes(e.target.value)} /> <br/>
      {totalMinutes > 0 ? (
        <>
          {calculateProposals().map((proposal, index) => ( //setta i valori scelti dalle proposte
            <button type='button' onClick={() => {setStudyTime(proposal.study); 
                                                  setBreakTime(proposal.break); 
                                                  setCycles(proposal.cycles)}}>

            Studio: {proposal.study} minuti - Pausa: {proposal.break} minuti - Cicli: {proposal.cycles}</button> 
          ))} 
        </>
      ):('')
      }


      <label htmlFor="study-time">Tempo singolo di studio (minuti):</label>
      <input type="number" id="study-time" value={studyTime} required onChange={(e) => setStudyTime(Number(e.target.value))} /> <br/>

      <label htmlFor="break-time">Tempo singolo di pausa (minuti):</label>
      <input type="number" id="break-time" value={breakTime} required onChange={(e) => setBreakTime(Number(e.target.value))} /> <br/>

      <label htmlFor="cycles">Cicli:</label>
      <input type="number" id="cycles" value={cycles} required  onChange={(e) => setCycles(Number(e.target.value))}/> <br/>

      <button type="submit" onClick={handleSubmit}>Inizia Sessione</button>
    </form>


      <h1>Timer:{convertTime()}</h1>
  </div>
);
};
export default Pomodoro;
