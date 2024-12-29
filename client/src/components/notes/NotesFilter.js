import React from "react";

const NotesFilter = ({ visibilityFilter, setVisibilityFilter }) => {
  return (
    <div className="visibility-filter">
      <label>Filtra per visibilità: </label>
      <select
        value={visibilityFilter}
        onChange={(e) => setVisibilityFilter(e.target.value)}
      >
        <option value="all">Tutte</option>
        <option value="public">Pubbliche</option>
        <option value="restricted">Ristrette</option>
        <option value="private">Private (miei)</option>
      </select>
    </div>
  );
};

export default NotesFilter;
