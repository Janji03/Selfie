import React from 'react';
import HomepageStyle from '../../styles/Homepage.css'

import TimeMachinePreview from '../preview/TimeMachinePreview';
import CalendarPreview from '../preview/CalendarPreview';

const Homepage = () => {
  return (


    <div>
      <div className='homepage-top'>

        <div className='homepage-subheader'> 
        <p>
            <strong>Organizza</strong> il tuo studio, <br />
            <strong>Ottimizza</strong> il tempo, <br />
            <strong>Raggiungi</strong> i tuoi obiettivi.
          </p>
          
        </div>     
          
      </div>
      <div className='homepage-bottom'>
        <div className='home-grid'>
          
          <div className='elem-grid full-width'>
            <i className="bi bi-calendar-event"></i> 
            <div className='subsection-calendar'>
              <CalendarPreview />
              <i className="bi bi-box-arrow-up-right"></i>
            </div>
            
          </div>
          <div className='elem-grid half-width'>
            <i className="bi bi-clock-history"></i>
            <h2>Pomodoro</h2>
            <i className="bi bi-box-arrow-up-right"></i>
          </div>
          <div className='elem-grid half-width'>
            <i className="bi bi-journal-plus"></i>
            <h2>Note</h2>
            <i className="bi bi-box-arrow-up-right"></i>
          </div>
        </div>   
        <TimeMachinePreview />
      </div>
    </div>
  );
};

export default Homepage;
