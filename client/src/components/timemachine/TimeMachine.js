import React, { useState } from "react";
import { useTimeMachine } from "../../context/TimeMachineContext";
import TimeMachineStyle from "../../styles/TimeMachine.css";
import { updateTimeMachine, resetTimeMachine } from "../../services/timeMachineService";

const formatDateTime = (date) => {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(date);
};

const formatDateTimeForInput = (date) => {
  const pad = (num) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const update = async (userID, newTime) => {
  try {
    await updateTimeMachine(userID, newTime);
  } catch (error) {
    console.error("Error while updating the time machine:", error.message);
  }
};

const reset = async (userID) => {
  try {
    await resetTimeMachine(userID);
  } catch (error) {
    console.error("Error while resetting the time machine:", error.message);
  }
};

const TimeMachine = () => {
  const userID = localStorage.getItem("userID");
  const { time, setTime, isTimeMachineActive, setIsTimeMachineActive } =
    useTimeMachine();
  const [inputTime, setInputTime] = useState(formatDateTimeForInput(time));

  const handleInputChange = (event) => {
    const value = event.target.value;
    const date = new Date(value);

    if (!isNaN(date.getTime())) {
      setInputTime(value);
    } else {
      setInputTime(formatDateTimeForInput(time));
    }
  };

  const handleUpdateTime = () => {
    const newTime = new Date(inputTime);
    setTime(newTime);
    update(userID, newTime);
    if (isTimeMachineActive) {
      setIsTimeMachineActive(false);
      setTimeout(() => {
        setIsTimeMachineActive(true);
      }, 10);
    } else {
      setIsTimeMachineActive(true);
    }
  };

  const resetToLocalTime = () => {
    const localTime = new Date();
    setTime(localTime);
    reset(userID);
    setIsTimeMachineActive(false);
    setInputTime(formatDateTimeForInput(localTime));
  };

  const isInputDifferent = formatDateTimeForInput(time) !== inputTime;

  return (
    <div className="time-machine">
      <p className="current-time">{formatDateTime(time)}</p>
      <div className="time-machine-controls">
          <input
          type="datetime-local"
          onChange={handleInputChange}
          value={inputTime}
        />
        {isInputDifferent && (
          <button onClick={handleUpdateTime} className="update-button">Update</button>
        )}
        <button onClick={resetToLocalTime} className="reset-button">Reset to Local Time</button>
      </div>
      
      {isTimeMachineActive ? (
        <h3>
          Time machine <span className="tm-active">ACTIVE</span>
        </h3>
      ) : (
        <h3>
          Time machine <span className="tm-not-active">NOT ACTIVE</span>
        </h3>
      )}
    </div>
  );
};

export default TimeMachine;
