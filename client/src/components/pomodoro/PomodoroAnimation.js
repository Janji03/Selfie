import React, { useEffect, useRef } from 'react';
import '../../../src/styles/PomodoroAnimation.css';

const PomodoroAnimation = ({ studyTime, breakTime, cycles, convertTime, timeLeft, onBreak, isRunning }) => {
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) {
      const animationDuration = onBreak ? breakTime * 60 : studyTime * 60;
      timerRef.current.style.setProperty('--timer-length', animationDuration);
    }
  }, [studyTime, breakTime, onBreak, timeLeft]);

  return (
    <div
      ref={timerRef}
      className={`timer-animation-countdown ${onBreak ? 'break-mode' : 'study-mode'} ${isRunning ? '' : 'paused'}`}
      style={{
        '--timer-length': (onBreak ? breakTime : studyTime) * 60,
        '--pause-length': breakTime * 60,
        '--cycles': cycles,
      }}
    >
      {convertTime(timeLeft)}
    </div>
  );
};

export default PomodoroAnimation;