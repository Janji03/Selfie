import React from "react";

const SortNotes = ({ notes, setNotes }) => {
  const handleSortChange = (event) => {
    const sortType = event.target.value;
    let sorted = [...notes];

    switch (sortType) {
      case "alphabetical":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "date":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "length":
        sorted.sort((a, b) => b.content.length - a.content.length);
        break;
      case "category":
        sorted.sort((a, b) => {
          const categoryA = a.categories[0]?.toLowerCase() || "";
          const categoryB = b.categories[0]?.toLowerCase() || "";
          return categoryA.localeCompare(categoryB);
        });
        break;
      default:
        return;
    }

    setNotes(sorted);
  };

  return (
    <div>
      <h3>Ordina Note</h3>
      <select onChange={handleSortChange} defaultValue="">
        <option value="" disabled>Seleziona un'opzione</option>
        <option value="alphabetical">Ordine Alfabetico</option>
        <option value="date">Data</option>
        <option value="length">Lunghezza Contenuto</option>
        <option value="category">Categoria</option>
      </select>
    </div>
  );
};

export default SortNotes;
