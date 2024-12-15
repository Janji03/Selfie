import React, { useState } from "react";
import { useTimeMachine } from "../../context/TimeMachineContext";

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

const TimeMachine = () => {
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
    setIsTimeMachineActive(false);
    setInputTime(formatDateTimeForInput(localTime));
  };

  const isInputDifferent = formatDateTimeForInput(time) !== inputTime;

  return (
    <div>
      <p>Current Time: {formatDateTime(time)}</p>
      <input
        type="datetime-local"
        onChange={handleInputChange}
        value={inputTime}
      />
      {isInputDifferent && (
        <button onClick={handleUpdateTime}>Update Time</button>
      )}
      <button onClick={resetToLocalTime}>Reset to Local Time</button>
      {isTimeMachineActive ? (
        <h3>
          TIME MACHINE <span style={{ color: "blue" }}>ACTIVE</span>
        </h3>
      ) : (
        <h3>
          TIME MACHINE <span style={{ color: "blue" }}>NOT ACTIVE</span>
        </h3>
      )}
    </div>
  );
};

export default TimeMachine;
