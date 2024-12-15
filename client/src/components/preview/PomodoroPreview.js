import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserPomodoros } from "../../services/pomodoroService";
import PreviewStyle from "../../styles/Preview.css";
import pomodoroIcon from "../pomodoro/pomodoro.png";

const PomodoroPreview = () => {
  const [lastPomodoro, setLastPomodoro] = useState(null);
  const userID = localStorage.getItem("userID");

  useEffect(() => {
    const getLastPomodoro = async () => {
      try {
        const listaPomodoro = await getUserPomodoros(1, userID);
        if (listaPomodoro && listaPomodoro.length > 0) {
          setLastPomodoro(listaPomodoro[0]); //capisci se serve vettore o meno
        } else {
          setLastPomodoro(null);
        }
        console.log("Get pomodoro okay");
      } catch (error) {
        console.error("Get pomodoro non okay: ", error);
      }
    };

    getLastPomodoro();
  }, [userID]);

  return (
    <div className="Pomodoro-preview">
      {lastPomodoro ? (
        <div>
          <img src={pomodoroIcon}></img>
          <div className="pomodoro-elements">
            <p>
              <strong>Study Time:</strong> <br /> {lastPomodoro.studyTime}{" "}
              minuti
            </p>
            <p>
              <strong>Break Time:</strong>
              <br /> {lastPomodoro.breakTime} minuti
            </p>
            <p>
              <strong>Cycles:</strong> <br />
              {lastPomodoro.cycles}
            </p>
          </div>
        </div>
      ) : (
        <p>Non trovato ultimo pomodoro</p>
      )}
      <Link to="/pomodoro" className="pomo-link">
        Vai al Pomodoro
      </Link>
    </div>
  );
};

export default PomodoroPreview;
