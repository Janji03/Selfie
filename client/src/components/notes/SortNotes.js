import React from "react";

const SortNotes = ({ notes, setNotes }) => {
  const sortAlphabetically = () => {
    const sorted = [...notes].sort((a, b) => a.title.localeCompare(b.title));
    setNotes(sorted);
  };

  const sortByDate = () => {
    const sorted = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setNotes(sorted);
  };

  const sortByLength = () => {
    const sorted = [...notes].sort((a, b) => b.content.length - a.content.length);
    setNotes(sorted);
  };

  return (
    <div>
      <h3>Ordina Note</h3>
      <button onClick={sortAlphabetically}>Ordine Alfabetico</button>
      <button onClick={sortByDate}>Data</button>
      <button onClick={sortByLength}>Lunghezza Contenuto</button>
    </div>
  );
};

export default SortNotes;
