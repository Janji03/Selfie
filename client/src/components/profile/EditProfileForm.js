import React from "react";

const EditProfileForm = ({ formData, handleInputChange, handleFileChange, handleFormSubmit, onCancel }) => {
  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData?.name || ""}
          onChange={handleInputChange}
          placeholder="Name"
        />
      </div>
      <div>
        <label htmlFor="profilePicture">Profile Picture:</label>
        <input
          type="file"
          id="profilePicture"
          name="profilePicture"
          onChange={handleFileChange}
        />
      </div>
      <div>
        <label htmlFor="bio">Bio:</label>
        <input
          type="text"
          id="bio"
          name="bio"
          value={formData?.bio || ""}
          onChange={handleInputChange}
          placeholder="Bio"
        />
      </div>
      <div>
        <label htmlFor="birthday">Birthday:</label>
        <input
          type="date"
          id="birthday"
          name="birthday"
          value={formData?.birthday ? formData.birthday.split("T")[0] : ""}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="sex">Sex:</label>
        <select
          id="sex"
          name="sex"
          value={formData?.sex || "prefer not to say"}
          onChange={handleInputChange}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer not to say">Prefer Not to Say</option>
        </select>
      </div>
      <div>
        <label htmlFor="pronouns">Pronouns:</label>
        <select
          id="pronouns"
          name="pronouns"
          value={formData?.pronouns || "prefer not to say"}
          onChange={handleInputChange}
        >
          <option value="he/him">He/Him</option>
          <option value="she/her">She/Her</option>
          <option value="they/them">They/Them</option>
          <option value="other">Other</option>
          <option value="prefer not to say">Prefer Not to Say</option>
        </select>
      </div>
      <button type="submit">Save Changes</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default EditProfileForm;
