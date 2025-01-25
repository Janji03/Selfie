import React, { useEffect, useState, useContext } from "react";
import {
  createPomodoro,
} from "../../services/pomodoroService";
import PomodoroAnimation from "./PomodoroAnimation";
import PomodoroEmailSender from "./PomodoroEmailSender";
import { updateCompletedCycles, updateEvent } from "../../services/eventService";
import { useLocation } from "react-router-dom";
import "../../styles/Pomodoro.css";
import pomodoroIcon from "../pomodoro/pomodoro.png";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


//bugghetti: se hai voglia aggiungi profilo e selfie, personalizzabile, abbellire
const Pomodoro = () => {
  const [studyTime, setStudyTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [initialStudyTime, setInitialStudyTime] = useState(0);
  const [initialBreakTime, setInitialBreakTime] = useState(0);
  const [remainingcycles, setRemainingCycles] = useState(0);
  const [initialCycles, setInitialCycles] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [onBreak, setOnBreak] = useState(false);
  const [sessionNumber, setSessionNumber] = useState(0);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isProposalOpen, setisProposalOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const userID = localStorage.getItem("userID");

  const { isAuthenticated } = useContext(AuthContext);

  const location = useLocation();
  const { id, title, pomodoroSettings, selectedEvent } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("inizio ciclo di studio");
    setTimeLeft(studyTime * 60);
    setRemainingCycles(initialCycles);
    setIsRunning(true);
    setOnBreak(false);
    setSessionNumber(sessionNumber + 1)
    setIsAnimationRunning(true)
    setAnimationKey((prevKey) => prevKey + 1);

    setInitialBreakTime(breakTime)
    setInitialStudyTime(studyTime)

    

    const pomodoroData = {
      studyTime: studyTime,
      breakTime: breakTime,
      cycles: initialCycles,
      userID: userID,
    };

    if(selectedEvent){
      const updatedEventPomodoroSettings = {
      ...selectedEvent,
        extendedProps: {
          ...selectedEvent.extendedProps,
          pomodoroSettings: {
            ...selectedEvent.extendedProps.pomodoroSettings,
            cycles: initialCycles,
            studyTime: studyTime,
            breakTime: breakTime,
    },},};

    try {
      await updateEvent(id, updatedEventPomodoroSettings);
      console.log("Sessione evento Pomodoro aggiornato correttamente");
    } catch (error) {
      console.error("Errore aggiornamento sessione pomdooro:", error);
    }
    }

    try {
      await createPomodoro(pomodoroData);
      console.log("Pomodoro salvato correttamente");
    } catch (error) {
      console.error("Errore creazione pomodoro:", error);
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
    if(isAuthenticated){
      if (searchParams) {
      const studyTime = searchParams.get("studyTime");
      const breakTime = searchParams.get("breakTime");
      const cycles = searchParams.get("cycles");
      setStudyTime(Number(studyTime));
      setBreakTime(Number(breakTime));
      setInitialCycles(Number(cycles));
    }

    if (pomodoroSettings) { //in modo che sia applicato solo all'inizio per settarli e poi se modificati non ritornano cosi controlla comunque
      setStudyTime(pomodoroSettings.studyTime)
      setBreakTime(pomodoroSettings.breakTime)
      setInitialCycles(pomodoroSettings.cycles)
      }
    }
  },[])


  useEffect(() => {  
    if (isRunning) {
      if (timeLeft > 0) {
        const interval = setInterval(() => {
          //fa andare il timer
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(interval);
      } else if (timeLeft === 0) {
        if (remainingcycles > 0) {
          //arriva da studio quindi onBreak falso allora setta pausa, arriva da pausa quindi onBreak vero allora setta studio
          if (!onBreak) {
            alert("inizio pausa");
            setRemainingCycles((prevCycles) => prevCycles - 1); //riduci cicli
            setTimeLeft(initialBreakTime * 60); //pausa
            if(pomodoroSettings && sessionNumber > 0){
              handleCycleCompletion(id, ((initialCycles-remainingcycles)+1));
            }
          } else {
            alert("inizio studio");
            setTimeLeft(initialStudyTime * 60);
          }
          setOnBreak(!onBreak);
        } else {
          //se finiti cicli e tempo = 0
          alert("Fine ciclo di studio");
          setIsRunning(false);
          setIsAnimationRunning(false)
          setRemainingCycles(initialCycles);
        }
      }
    }
  }, [isRunning, timeLeft]);

  return (
    <div>
      <div className="pomodoro">
        <div className="pomodoro-body">
          <div className="left-pomodoro">
            <img src={pomodoroIcon}></img>
            <h1>POMODORO TECHNIQUE</h1>
            <form className="study-form" onSubmit={handleSubmit}>
              <div className="pomo-info-form">
                <label htmlFor="total-time" className="long-label">Tempo complessivo:</label>
                <label htmlFor="total-time" className="short-label">Quanto tempo vuoi studiare?</label>
                <input
                  type="number"
                  id="total-time"
                  value={totalMinutes}
                  onChange={(e) => {
                    setTotalMinutes(e.target.value); 
                    if(e.target.value > 5){
                      setisProposalOpen(true)
                    } else setisProposalOpen(false)
                    }}
                />{" "}
                <br />
                {(totalMinutes > 5 && isProposalOpen) && (
                  <>
                  <div className="form-proposals">
                    {calculateProposals().map(
                      (
                        proposal,
                        index //setta i valori scelti dalle proposte
                      ) => (
                        <button
                          className="proposal-button"
                          key={index}
                          type="button"
                          onClick={() => {
                            setStudyTime(proposal.study);
                            setBreakTime(proposal.break);
                            setInitialCycles(proposal.cycles);
                            setRemainingCycles(proposal.cycles);
                            setisProposalOpen(false);
                          }}
                        >
                          <strong>Studio</strong>: {proposal.study} minuti, <br/> <strong>Pausa</strong>: {proposal.break} minuti, <strong>Cicli</strong>: {proposal.cycles}
                        </button>
                      )
                    )}
                  </div>
                    
                  </>
                )}
              </div>


                { !isProposalOpen && (
                  <>
                    <span className="or">OR</span>

                  <div className="pomo-info-form">
                    <label htmlFor="study-time" className="long-label">Tempo di studio (minuti):</label>
                    <label htmlFor="study-time" className="short-label">Studio</label>
                    <input
                      type="number"
                      id="study-time"
                      min={1}
                      value={studyTime}
                      required
                      onChange={(e) => {
                        setStudyTime(Number(e.target.value))}}
                    />{" "}
                    <br />
                  </div>

                  <div className="pomo-info-form">
                    <label htmlFor="break-time" className="long-label">Tempo di pausa (minuti):</label>
                    <label htmlFor="break-time" className="short-label">Break</label>
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
                    <label htmlFor="cycles" className="long-label">Cicli:</label> 
                    <label htmlFor="cycles" className="short-label">Cicli</label> 
                    <input
                      type="number"
                      id="cycles"
                      min={1}
                      value={initialCycles}
                      required
                      onChange={(e) => {
                        setInitialCycles(Number(e.target.value));
                      }}
                    />{" "}
                    <br />
                    <button
                      className="but-start horizontal-layout"
                      type="submit"
                    >
                      Inizia Sessione
                    </button>
                  </div>
                  </>
                )} 
            </form>
          </div>
          
          <div className="right-pomodoro">
          
            {pomodoroSettings && (
              <h2 className="pomodoro-logo">{title}</h2>
            )}


            {(isAnimationRunning) ? (
              <PomodoroAnimation key={animationKey} studyTime={initialStudyTime} breakTime={initialBreakTime} cycles={remainingcycles} timeLeft={timeLeft} convertTime={convertTime} onBreak={onBreak} isRunning={isRunning}/>
            ): (
              <PomodoroAnimation key={animationKey} studyTime={0} breakTime={0} cycles={0} timeLeft={0} convertTime={convertTime} onBreak={onBreak} isRunning={isRunning}/>
            )}

            <div className="pomodoro-applyers">
              <button onClick={() => {
              setTimeLeft(0)}
              }
              className="pomo-button"
              >Prossima fase</button>

              
              <button onClick={() => {
                if(onBreak){
                  setTimeLeft(initialBreakTime * 60)
                } else {setTimeLeft(initialStudyTime * 60)
                }
                setAnimationKey((prevKey) => prevKey + 1);
                alert('ricomincia questo ciclo')
              }}
              className="pomo-button">Ricomincia fase</button>


              <button onClick={handleSubmit}
              className="pomo-button"
              >
              Ricomincia sessione</button>


              <button onClick={() => {
                  setIsRunning(false);
                  setIsAnimationRunning(false);
                  setTimeLeft(0)
                  setRemainingCycles(0)
                  alert('ciclo terminato forzato')
              }}
              className="pomo-button"
              >Concludi Sessione</button> 
            </div>

              <div className="pomodoro-applyers">
                <PomodoroEmailSender studyTime={studyTime} breakTime={breakTime} cycles={initialCycles}/>
              {isRunning ? (
                <i className="bi bi-pause-circle-fill pause-start-button" onClick={() => {setIsRunning(!isRunning)}}></i>
              ) : (
                <i className="bi bi-play-circle-fill  pause-start-button" onClick={() => {setIsRunning(!isRunning)}}></i>
              )}
              </div>
              
              
          </div>
        </div>

        <button
                  className="but-start vertical-layout"
                  onClick={handleSubmit}
                >
                  Inizia Sessione
                </button>
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
