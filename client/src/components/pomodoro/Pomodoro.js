import React, { useEffect, useState } from "react";
import {
  createPomodoro,
  getUserPomodoros,
} from "../../services/pomodoroService";
import { updateCompletedCycles } from "../../services/eventService";
import { useLocation } from "react-router-dom";
import PomodoroStyle from "../../styles/Pomodoro.css";

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
  const [sessionNumber, setSessionNumber] = useState(0);
  const userID = localStorage.getItem("userID");


  const location = useLocation();
  const { id, title, pomodoroSettings } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("inizio ciclo di studio");
    setTimeLeft(studyTime * 60);
    setRemainingCycles(initialCycles);
    setIsRunning(true);
    setOnBreak(false);
    setSessionNumber(sessionNumber + 1)

    const pomodoroData = {
      studyTime: studyTime,
      breakTime: breakTime,
      cycles: initialCycles,
      userID: userID,
    };


    /* setStudyTime(0);
    setBreakTime(0);
    setInitialCycles(0);
    setTotalMinutes(0); */

    try {
      await createPomodoro(pomodoroData);
      console.log("Pomodoro salvato correttamente");
    } catch (error) {
      console.error("Errore creazione pomodoro:", error);
    }
  };



  const handleGet = async () => {
    try {
      const listaPomodoro = await getUserPomodoros(nPomodoro, userID);
      console.log("Get pomodoro okay");
      console.log(listaPomodoro);
    } catch (error) {
      console.error("Get pomodoro non okay: ", error);
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
  };



  //converte numeri normali in tempo
  const convertTime = () => {
    const seconds = timeLeft;
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    return `${minutes}:${remainderSeconds < 10 ? "0" : ""}${remainderSeconds}`;
  };



  const handleCycleCompletion = async (eventId, completedCycles) => {
    try {
      const updatedEvent = await updateCompletedCycles(eventId, completedCycles);
      console.log("Evento aggiornato con successo:", updatedEvent);
    } catch (error) {
      console.error("Errore durante l'aggiornamento dei cicli completati:", error.message);
    }
  };



  useEffect(() => {
    if (pomodoroSettings) {
      setStudyTime(pomodoroSettings.studyTime)
      setBreakTime(pomodoroSettings.breakTime)
      setInitialCycles(pomodoroSettings.cycles)
      }
    
    if (isRunning) {
      if (timeLeft > 0) {
        const interval = setInterval(() => {
          //fa andare il timer
          setTimeLeft((prevTime) => prevTime - 1);
        }, 20);

        return () => clearInterval(interval);
      } else if (timeLeft === 0) {
        if (remainingcycles > 0) {
          //arriva da studio quindi onBreak falso allora setta pausa, arriva da pausa quindi onBreak vero allora setta studio
          if (!onBreak) {
            alert("inizio pausa");
            setRemainingCycles((prevCycles) => prevCycles - 1); //riduci cicli
            setTimeLeft(breakTime * 60); //pausa
            if(pomodoroSettings && sessionNumber > 0){
              handleCycleCompletion(id, ((initialCycles-remainingcycles)+1));
            }
          } else {
            alert("inizio studio");
            setTimeLeft(studyTime * 60);
          }
          setOnBreak(!onBreak);
        } else {
          //se finiti cicli e tempo = 0
          alert("Fine ciclo di studio");
          setIsRunning(false);
          setRemainingCycles(initialCycles);
        }
      }
    }
  }, [isRunning, timeLeft, pomodoroSettings]);

  return (
    <div>
      <div className="pomodoro">
        <div className="pomodoro-header">
          <div className="pomodoro-logo">
            <h1>Selfie</h1>
          </div>
          <div className="pomodoro-nav">
            <h4 className="pomodoro-nav-page">Pomodoro</h4>
            <h4>Note</h4>
            <h4>Calendario</h4>
            <i className="bi bi-person-fill"></i>
          </div>
        </div>

        <div className="pomodoro-body">
          <div className="left-pomodoro">
            <h1>POMODORO TECHNIQUE</h1>
            <form className="study-form" onSubmit={handleSubmit}>
              <div className="pomo-info-form">
                <label htmlFor="total-time">Tempo complessivo:</label>
                <input
                  type="number"
                  id="total-time"
                  min={1}
                  value={totalMinutes}
                  onChange={(e) => setTotalMinutes(e.target.value)}
                />{" "}
                <br />
                {totalMinutes > 0 ? (
                  <>
                    {calculateProposals().map(
                      (
                        proposal,
                        index //setta i valori scelti dalle proposte
                      ) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setStudyTime(proposal.study);
                            setBreakTime(proposal.break);
                            setInitialCycles(proposal.cycles);
                            setRemainingCycles(proposal.cycles);
                          }}
                        >
                          Studio: {proposal.study} minuti - Pausa:{" "}
                          {proposal.break} minuti - Cicli: {proposal.cycles}
                        </button>
                      )
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>

              <div className="pomo-info-form">
                <label htmlFor="study-time">Tempo di studio (minuti):</label>
                <input
                  type="number"
                  id="study-time"
                  min={1}
                  value={studyTime}
                  required
                  onChange={(e) => setStudyTime(Number(e.target.value))}
                />{" "}
                <br />
              </div>

              <div className="pomo-info-form">
                <label htmlFor="break-time">Tempo di pausa (minuti):</label>
                <input
                  type="number"
                  id="break-time"
                  min={1}
                  value={breakTime}
                  required
                  onChange={(e) => setBreakTime(Number(e.target.value))}
                />{" "}
                <br />
              </div>

              <div className="pomo-info-form">
                <label htmlFor="cycles">Cicli:</label>
                <input
                  type="number"
                  id="cycles"
                  min={1}
                  value={initialCycles}
                  required
                  onChange={(e) => {
                    setRemainingCycles(Number(e.target.value));
                    setInitialCycles(Number(e.target.value));
                  }}
                />{" "}
                <br />
                <button
                  className="but-plus"
                  type="button"
                  onClick={() => setInitialCycles(initialCycles + 1)}
                >
                  +
                </button>
                <button
                  className="but-min"
                  type="button"
                  onClick={() =>
                    setInitialCycles(Math.max(1, initialCycles - 1))
                  }
                >
                  -
                </button>
                <button
                  className="but-start"
                  type="submit"
                >
                  Inizia Sessione
                </button>
              </div>
            </form>
          </div>
          <div className="right-pomodoro">
            <button onClick={handleGet}> get</button>

            {pomodoroSettings && (
              <h2>{title}</h2>
            )}

            <h1>Timer:{convertTime()}</h1>

            <button onClick={() => {
              setTimeLeft(1)}
              }>Vai al prossimo</button>


              <button onClick={() => {
                if(onBreak){
                  setTimeLeft(breakTime * 60)
                } else setTimeLeft(studyTime * 60)
                alert('ricomincia questo ciclo')
              }}>Ricomincia questo</button>


            <button onClick={handleSubmit}>
              Ricomincia tutto</button>


              <button onClick={() => {
                  setIsRunning(false);
                  alert('ciclo terminato forzato')
              }}>Fine tutto</button> 

          </div>
        </div>
      </div>

      {/* <h1>Pomodoro Timer</h1>

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
      }}>Fine tutto</button> */}
    </div>
  );
};

export default Pomodoro;
