import React from 'react';
import { Link } from 'react-router-dom';

const NotesPreview = () => {
  return (
    <div>
      <h3>Note</h3>
      <p>Scrivi, organizza e recupera facilmente le tue note.</p>
      <Link to="/notes">Vai alle Note</Link>
    </div>
  );
};

export default NotesPreview;
