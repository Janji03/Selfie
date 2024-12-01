import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getUser, updateUser, updateUserProfilePicture, deleteUser } from '../../services/userService';
import Modal from '../common/Modal';
import EditProfileForm from './EditProfileForm';

const Profile = () => {
  const [user, setUser] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState("");

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const userID = localStorage.getItem('userID');

  const baseURL = "http://localhost:5000/";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userID) {
          const userInfo = await getUser(userID);
          setUser(userInfo); 
          setFormData(userInfo);
          if (userInfo.profilePicture) {
            setProfileImage(baseURL + userInfo.profilePicture);
          }
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

  const toggleEditModal = () => setIsEditModalOpen((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, profilePicture: file }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result); 
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.profilePicture instanceof File) {
        const profilePictureResponse = await updateUserProfilePicture(userID, formData.profilePicture);
        formData.profilePicture = profilePictureResponse.profilePicture;
        setProfileImage(baseURL + profilePictureResponse.profilePicture);
      }
      await updateUser(userID, formData);
      setUser(formData); 
      toggleEditModal(); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(userID); 
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
          {profileImage && <img src={profileImage} alt="Profile" width="100" />}
          <p>Email: {user.email}</p>
          <p>Bio: {user.bio}</p>
          <p>Birthday: {user.birthday}</p>
          <p>Sex: {user.sex}</p>

        </div>
      ) : (
        <p>Loading...</p>
      )}

      <button onClick={toggleEditModal}>Edit Profile</button>

      <Modal isOpen={isEditModalOpen} onClose={toggleEditModal} title="Edit Profile">
        <EditProfileForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          handleFormSubmit={handleFormSubmit}
          onCancel={toggleEditModal}
        />
      </Modal>
      
      <button onClick={handleDelete}>Delete Profile</button>

      <button onClick={handleLogout}>Logout</button>

      {error && <p>{error}</p>}
    </div>
  );
};

export default Profile;
