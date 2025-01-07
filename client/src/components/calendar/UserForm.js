import React, { useEffect, useState } from "react";
import { getAllUsersBasicInfo } from "../../services/userService";

const UserForm = ({ formData, setFormData }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  const userID = localStorage.getItem("userID");

  useEffect(() => {
    getAllUsersBasicInfo().then(setUsers);
  }, []);

  useEffect(() => {
    if (query) {
      const filtered = users.filter(
        (user) =>
          (user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())) &&
          !formData.invitedUsers.includes(user._id) &&
          user._id !== userID
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query, users, formData.invitedUsers]);

  const handleAddUser = (user) => {
    if (
      formData.invitedUsers.some((invitedUser) => invitedUser.userID === user._id)
    ) {
      setError("User already added.");
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        invitedUsers: [
          ...prevFormData.invitedUsers,
          { userID: user._id, status: "pending" }, 
        ],
      }));
      setError("");
      setQuery("");
      setSuggestions([]);
    }
  };

  const handleRemoveUser = (id) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      invitedUsers: prevFormData.invitedUsers.filter(
        (invitedUser) => invitedUser.userID !== id
      ),
    }));
  };

  const invitedUserDetails = formData.invitedUsers.map((invitedUser) => {
    const user = users.find((u) => u._id === invitedUser.userID);
    return user ? { ...user, status: invitedUser.status } : null;
  }).filter(Boolean);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type name or email"
        className="form-input"
      />
      {error && <span className="error-message">{error}</span>}

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((user, index) => (
            <li
              key={`suggestion-${user._id}-${index}`}
              onClick={() => handleAddUser(user)}
              className="suggested-user-item"
            >
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}

      <div className="invited-users">
        {invitedUserDetails.map((user) => (
          <div key={`invited-${user._id}`} className="invited-user-item">
            <div className="user-details">
            <strong>{user.name}</strong> 
            <div className="user-email">{user.email}</div> 
          </div>
            <button
              type="button"
              className="form-button remove-user"
              onClick={() => handleRemoveUser(user._id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserForm;
