import React, { useState } from "react";
import TimeZoneForm from "../TimeZoneForm";
import "../../../styles/Form.css";

const TaskForm = ({ initialData, onSubmit, isEditMode }) => {
  const [formData, setFormData] = useState({
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  const MAX_TITLE_LENGTH = 200;

  const validateForm = () => {
    const newErrors = {};
    const { title, deadlineDate, deadlineTime } = formData;

    if (title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Task title can be max ${MAX_TITLE_LENGTH} characters.`;
    }

    if (!deadlineDate) {
      newErrors.deadlineDate = "Deadline date is required.";
    }

    if (!deadlineTime) {
      newErrors.deadlineTime = "Deadline time is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const adjustedFormData = { ...formData };
      if (
        !adjustedFormData.title ||
        adjustedFormData.title.trim().length === 0
      ) {
        adjustedFormData.title = "New Task";
      }

      if (adjustedFormData.allDay) {
        adjustedFormData.deadlineTime = "00:00";
      }

      onSubmit({ ...adjustedFormData });
    }
  };

  const handleTimeZoneChange = (selectedTimeZone) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      timeZone: selectedTimeZone,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleResetChanges = () => {
    setFormData({ ...initialData });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label className="form-label">Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
          />
          {errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
        </div>
        {/* All Day */}
        <div>
          <label>
            <input
              type="checkbox"
              name="allDay"
              checked={formData.allDay}
              onChange={handleChange}
              className="checkbox-input"
            />
            <span className="checkbox-label">All Day</span>
          </label>
        </div>
        {/* Deadline Date*/}
        <div>
          <label className="form-label">Deadline date:</label>
          <input
            type="date"
            name="deadlineDate"
            value={formData.deadlineDate}
            onChange={handleChange}
            className="form-input"
          />
          {errors.deadlineDate && (
            <span className="error-message">{errors.deadlineDate}</span>
          )}
        </div>
        {/* Deadline Time */}
        {!formData.allDay && (
          <div>
            <label className="form-label">Deadline time:</label>
            <input
              type="time"
              name="deadlineTime"
              value={formData.deadlineTime}
              onChange={handleChange}
              className="form-input"
            />
            {errors.deadlineTime && (
            <span className="error-message">{errors.deadlineTime}</span>
          )}
          </div>
        )}
        {/* Notifications */}
        <div>
          <label>
            <input
              type="checkbox"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
              className="checkbox-input"
            />
            <span className="checkbox-label">Overdue Notifications</span>
          </label>
        </div>
        {/* Time Zone */}
        <div>
          <label className="form-label">Time Zone:</label>
          <TimeZoneForm
            initialTimeZone={formData.timeZone}
            onSubmit={handleTimeZoneChange}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="form-button form-submit">
          {isEditMode ? "Save Changes" : "Add Task"}
        </button>

        {/* Reset Button (only in edit mode) */}
        {isEditMode && (
          <button type="button" onClick={handleResetChanges} className="form-button form-reset">
            Reset Changes
          </button>
        )}
      </form>
    </div>
  );
};

export default TaskForm;
