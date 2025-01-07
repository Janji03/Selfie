import React, { useState, useEffect } from "react";

const NotificationForm = ({ formData, setFormData }) => {
  const [error, setError] = useState('');

  const MAX_NOTIFICATIONS = 5;

  const timeOptions = {
    0: "At the time of the event",
    5: "5 minutes before",
    10: "10 minutes before",
    15: "15 minutes before",
    30: "30 minutes before",
    60: "1 hour before",
    120: "2 hours before",
    1440: "1 day before",
    2880: "2 days before",
    10080: "1 week before",
  };

  const handleNotificationChange = (index, field, value) => {
    const updatedNotifications = [...formData.notifications];
    updatedNotifications[index] = {
      ...updatedNotifications[index],
      [field]: value,
    };

    setFormData((prevFormData) => ({
      ...prevFormData,
      notifications: updatedNotifications,
    }));
  };

  const addNotification = () => {
    const newNotification = {
      timeBefore: 0,
      isSent: false,
    };

    if (formData.notifications.length >= MAX_NOTIFICATIONS) {
      setError('You can add only up to 5 notifications.');
      return;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      notifications: [newNotification, ...(prevFormData.notifications || [])],
    }));
  };

  const removeNotification = (index) => {
    const updatedNotifications = formData.notifications.filter(
      (_, i) => i !== index
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      notifications: updatedNotifications,
    }));
  };

  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [formData, error]);

  return (
    <div>
      <button
        type="button"
        className="form-button add-notification"
        onClick={addNotification}
      >
        Add
      </button>
      <br />
      {error && (
        <span className="error-message">{error}</span>
      )}
      {/* Notification List */}
      {formData.notifications?.map((notif, index) => (
        <div key={index} className="notification-container">
          {/* Time Before Event */}
          <div>
            <label className="form-label">Time Before Event:</label>
            <select
              className="form-input"
              value={notif.timeBefore}
              onChange={(e) =>
                handleNotificationChange(index, "timeBefore", e.target.value)
              }
            >
              {Object.entries(timeOptions).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Remove Notification */}
          <button
            type="button"
            className="form-button remove-notification"
            onClick={() => removeNotification(index)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationForm;
