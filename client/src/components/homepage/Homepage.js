import React from 'react';
import HomepageStyle from '../../styles/Homepage.css'
import ProfilePreview from '../preview/ProfilePreview'
import CalendarPreview from '../preview/CalendarPreview'
import PomodoroPreview from '../preview/PomodoroPreview'
import NotesPreview from '../preview/NotesPreview'


const Homepage = () => {
  return (


    <div>
      <div className='homepage-top'>

        <div className='homepage-header'>
        <h1>Selfie</h1>
          <i class="bi bi-person-fill"></i>
        
        </div> 
        <div className='homepage-subheader'> 
        <p>
            <strong>Organizza</strong> il tuo studio, <br />
            <strong>Ottimizza</strong> il tempo, <br />
            <strong>Raggiungi</strong> i tuoi obiettivi.
          </p>
          {/* <span className='homepage-top-buttons'>
            <button className='login'> Log In</button>
            <button className='signup'> Sign Up</button>
          </span> */}
          
        </div>     
          
      </div>
      <div className='homepage-bottom'>
        <div className='home-grid'>
          <ProfilePreview/>
          <div className='elem-grid full-width'>
            <i class="bi bi-calendar-event"></i> 
            <div className='subsection-calendar'>
              <h2>Calendario</h2>
              <p>Aggiungi eventi per non dimenticare</p>
              <CalendarPreview />
            </div>
            
          </div>
          <div className='elem-grid half-width'>
            <i class="bi bi-clock-history"></i>
            <h2>Pomodoro</h2>
            <PomodoroPreview />
          </div>
          <div className='elem-grid half-width'>
            <i class="bi bi-journal-plus"></i>
            <h2>Note</h2>
            <NotesPreview />
          </div>
        </div>   
      </div>
    </div>
  );
};

export default Homepage;
