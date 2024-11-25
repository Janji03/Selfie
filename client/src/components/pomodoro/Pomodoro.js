import React, { useEffect, useState } from 'react';
import { createPomodoro, getPreviousPomodoro } from '../../services/pomodoroService';

const Pomodoro = () => {
  const [studyTime, setStudyTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [remainingcycles, setRemainingCycles] = useState(0);
  const [initialCycles, setInitialCycles] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [onBreak, setOnBreak] = useState(false); 
  const [nPomodoro, setNPomodoro] = useState(0);


  const handleSubmit = async () => {
    alert('inizio ciclo di studio')
    setTimeLeft(studyTime * 60)
    setRemainingCycles(initialCycles)
    setIsRunning(true)
    setOnBreak(false)


    const pomodoroData = {
      studyTime,
      breakTime,
      cycles: initialCycles,
    };

    try {
      await createPomodoro(pomodoroData);
      console.log('Pomodoro salvato correttamente');
    } catch (error) {
      console.error('Errore creazione pomodoro: ', error);
    }
  };

  const handleGet = async () => {
     try{
      const listaPomodoro = await getPreviousPomodoro(nPomodoro);
      console.log('Get okay')
      console.log(listaPomodoro)
     } catch(error) {
      console.error('Get non okay: ', error)
     }
  }



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
          if (remainingcycles > 0) {
            //arriva da studio quindi onBreak falso allora setta pausa, arriva da pausa quindi onBreak vero allora setta studio
            if(!onBreak){ 
              alert('inizio pausa')
              setRemainingCycles((prevCycles) => prevCycles - 1); //riduci cicli
              setTimeLeft(breakTime * 60); //pausa
            } else {
              alert('inizio studio')
              setTimeLeft(studyTime * 60);
            }
            setOnBreak(!onBreak);

          } else { //se finiti cicli e tempo = 0
            alert('Fine ciclo di studio');
            setIsRunning(false);
            setRemainingCycles(initialCycles)
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
            <button key={index} type='button' onClick={() => {setStudyTime(proposal.study); 
                                                  setBreakTime(proposal.break); 
                                                  setInitialCycles(proposal.cycles);
                                                  setRemainingCycles(proposal.cycles)}}>

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
      <input type="number" id="cycles" value={initialCycles} required  onChange={(e) => {setRemainingCycles(Number(e.target.value)); 
                                                                                         setInitialCycles(Number(e.target.value));}}/> <br/>

      <button type="submit" onClick={handleSubmit}>Inizia Sessione</button>
    </form>


      <h1>Timer:{convertTime()}</h1>

      <input type='number' onChange={(e) => setNPomodoro(e.target.value)}></input>
      <button onClick={handleGet}>prova backend</button>

      <h2>{nPomodoro}</h2> <h2>{remainingcycles}</h2>



     <button onClick={() => {
      setTimeLeft(1)}
      }>Vai al prossimo</button>


      <button onClick={() => {
        if(onBreak){
          setTimeLeft(breakTime * 60)
        } else setTimeLeft(studyTime * 60)
        alert('ricomincia questo ciclo')
      }}>Ricomincia questo</button>


    <button onClick={() => {
            handleSubmit();
          }}>Ricomincia tutto</button>


      <button onClick={() => {
          setIsRunning(false);
          alert('ciclo terminato forzato')
      }}>Fine tutto</button>

  </div>
);
};

export default Pomodoro;
