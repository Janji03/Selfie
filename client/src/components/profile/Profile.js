import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getUser, updateUser, deleteUser } from '../../services/userService';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const userID = localStorage.getItem('userID');

  console.log("token", token);
  console.log("userID", userID);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userID && token) {
          const userInfo = await getUser(userID, token);
          setUser(userInfo); 
        }
      } catch (err) {
        setError(err.message); 
      }
    };

    fetchUserData(); 
  }, [userID, token]);


  const handleLogout = async () => {
    try {
      logout(); 
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(userID, token); 
      logout(); 
      navigate('/login'); 
    } catch (err) {
      setError(err.message); 
    }
  };

  return (
    <div>
      <h1>Profilo</h1>

      {user ? (
        <div>
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Bio: {user.bio}</p>
          <p>Pronouns: {user.pronouns}</p>
          <p>Birthday: {new Date(user.birthday).toLocaleDateString()}</p>
          <p>Sex: {user.sex}</p>
          {/* Placeholder per bottone per modificare le informazioni*/}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      
      <button onClick={handleLogout}>Logout</button>

      <button onClick={handleDelete}>Delete Profile</button>

      {error && <p>{error}</p>}
    </div>
  );
};

export default Profile;
