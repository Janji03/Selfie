import React, { createContext, useState, useContext } from 'react';

const TimeMachineContext = createContext();

export const TimeMachineProvider = ({ children }) => {
    const [time, setTime] = useState(new Date()); 

    return (
        <TimeMachineContext.Provider value={{ time, setTime }}>
            {children}
        </TimeMachineContext.Provider>
    );
};

export const useTimeMachine = () => {
    return useContext(TimeMachineContext);
};
