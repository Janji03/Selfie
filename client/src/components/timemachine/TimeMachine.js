import React, { useState, useEffect } from 'react';
import { useTimeMachine } from '../../context/TimeMachineContext';

const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'full',
        timeStyle: 'medium',
    }).format(date);
};

const formatDateTimeForInput = (date) => {
    const pad = (num) => String(num).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); 
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const TimeMachine = () => {
    const { time, setTime } = useTimeMachine();
    const [currentTime, setCurrentTime] = useState(time);
    const [inputTime, setInputTime] = useState(formatDateTimeForInput(time)); 

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime((prevTime) => new Date(prevTime.getTime() + 1000));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleInputChange = (event) => {
        const value = event.target.value;
        const date = new Date(value);
    
        if (!isNaN(date.getTime())) {
            setInputTime(value);
        } else {
            const correctedDate = new Date(currentTime);
            correctedDate.setDate(1); 
            setInputTime(formatDateTimeForInput(correctedDate));
        }
    };

    const handleUpdateTime = () => {
        const newTime = new Date(inputTime); 
        setTime(newTime); 
        setCurrentTime(newTime); 
    };

    const resetToLocalTime = () => {
        const localTime = new Date();
        setTime(localTime);
        setCurrentTime(localTime);
        setInputTime(formatDateTimeForInput(localTime)); 
    };

    const isInputDifferent = formatDateTimeForInput(currentTime) !== inputTime;

    return (
        <div>
            <p>Current Time: {formatDateTime(currentTime)}</p>
            <input
                type="datetime-local"
                onChange={handleInputChange}
                value={inputTime}
            />
            {isInputDifferent && (
                <button onClick={handleUpdateTime}>Update Time</button>
            )} 
            <button onClick={resetToLocalTime}>Reset to Local Time</button>
        </div>
    );
};

export default TimeMachine;
