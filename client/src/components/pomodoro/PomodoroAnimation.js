import React from 'react';
import '../../../src/styles/PomodoroAnimation.css';

const PomodoroAnimation = ({ studyTime, breakTime, cycles, convertTime, timeLeft, onBreak }) => {

  return (
    <div
      className={`timer-animation-countdown ${onBreak ? 'break-mode' : 'study-mode'}`}
      style={{
        '--timer-length': studyTime * 60,
        '--pause-length': breakTime * 60,
        '--cycles': cycles,
      }}
    >
      {convertTime(timeLeft)}
    </div>
  );
};

export default PomodoroAnimation;
