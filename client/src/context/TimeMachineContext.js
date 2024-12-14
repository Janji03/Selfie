import React, { createContext, useState, useContext, useEffect } from 'react';

const TimeMachineContext = createContext();

export const TimeMachineProvider = ({ children }) => {
    const [time, setTime] = useState(new Date()); 
    const [isTimeMachineActive, setIsTimeMachineActive] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime((prevTime) => new Date(prevTime.getTime() + 1000));
        }, 1000);

        return () => clearInterval(timer); 
    }, []);

    return (
        <TimeMachineContext.Provider value={{ time, setTime, isTimeMachineActive, setIsTimeMachineActive }}>
            {children}
        </TimeMachineContext.Provider>
    );
};

export const useTimeMachine = () => {
    return useContext(TimeMachineContext);
};
