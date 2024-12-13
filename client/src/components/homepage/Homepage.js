import React, { useState } from 'react';
import HomepageStyle from '../../styles/Homepage.css';
import PomodoroPreview from '../preview/PomodoroPreview';
import NotesPreview from '../preview/NotesPreview';

const Homepage = () => {
  const [isCalendarPreviewOpen, setIsCalendarPreviewOpen] = useState(false);
  const [isPomodoroPreviewOpen, setIsPomodoroPreviewOpen] = useState(false);
  const [isNotePreviewOpen, setIsNotePreviewOpen] = useState(false);

  //scelta anteprima da mostrare
  const renderPreview = () => {
    if (isCalendarPreviewOpen) {
      return (
        <div className='home-preview calendario-preview'>
          <i className="bi bi-x-lg" onClick={() => setIsCalendarPreviewOpen(false)}></i>
          <h2>Calendario Preview</h2>
        </div>
      );
    }

    if (isNotePreviewOpen) {
      return (
        <div className='home-preview note-preview'>
          <i className="bi bi-x-lg" onClick={() => setIsNotePreviewOpen(false)}></i>
          <NotesPreview/>
        </div>
      );
    }

    if (isPomodoroPreviewOpen) {
      return (
        <div className='home-preview pomodoro-preview'>
          <i className="bi bi-x-lg" onClick={() => setIsPomodoroPreviewOpen(false)}></i>
          <PomodoroPreview/>
        </div>
      );
    }

    // se nessuna anteprima è aperta
    return (
      <div className='home-grid'>
        <div className='elem-grid full-width'>
          <i className="bi bi-calendar-event"></i>
          <div className='subsection-calendar'>
            <h2>Calendario</h2>
            <p>Aggiungi eventi per non dimenticare</p>
            <i
              className="bi bi-box-arrow-up-right"
              onClick={() => setIsCalendarPreviewOpen(true)}
            ></i>
          </div>
        </div>

        <div className='elem-grid half-width'>
          <i className="bi bi-clock-history"></i>
          <h2>Pomodoro</h2>
          <i
            className="bi bi-box-arrow-up-right"
            onClick={() => setIsPomodoroPreviewOpen(true)}
          ></i>
        </div>

        <div className='elem-grid half-width'>
          <i className="bi bi-journal-plus"></i>
          <h2>Note</h2>
          <i
            className="bi bi-box-arrow-up-right"
            onClick={() => setIsNotePreviewOpen(true)}
          ></i>
        </div>

        </div>
    );
  };

  return (
    <div>
      
      <div className='homepage-top'>
        <div className='homepage-header'>
          <h1>Selfie</h1>
          <i className="bi bi-person-fill"></i>
        </div>
        <div className='homepage-subheader'>
          <p>
            <strong>Organizza</strong> il tuo studio, <br />
            <strong>Ottimizza</strong> il tempo, <br />
            <strong>Raggiungi</strong> i tuoi obiettivi.
          </p>
        </div>
      </div>

      
      <div className='homepage-bottom'>
        {renderPreview()}


        <div className="home-page-wide">

        <div className="bottom-home-page-section section-white">
          <div className="section-description">
            <h1 className="title">Calendario</h1>
            <p className="subtitle">Organizza le tue giornate in modo semplice e intuitivo.</p>
          </div>
          <div className="preview">
            <div className="preview-box">Anteprima Calendario</div>
          </div>
        </div>

        <div className="bottom-home-page-section section-blue">
          <div className="preview">

            <div className="preview-box">          
              <PomodoroPreview/></div>
            </div>

          <div className="section-description">
            <h1 className="title">Pomodoro Technique</h1>
            <p className="subtitle">Massimizza la tua produttività con sessioni di lavoro focalizzate.</p>
          </div>
        </div>

        <div className="bottom-home-page-section section-white">
          <div className="section-description">
            <h1 className="title">Note</h1>
            <p className="subtitle">Appunta le tue idee e i tuoi pensieri in un istante.</p>
          </div>

          <div className="preview">
            <div className="preview-box">
              <NotesPreview/></div>
          </div>

        </div>
        </div>

      </div>
    </div>
  );
};

export default Homepage;
