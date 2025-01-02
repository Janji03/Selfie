import React from "react";

const NotificationForm = ({ formData, setFormData }) => {
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

  const handleMethodChange = (index, method, checked) => {
    const updatedNotifications = [...formData.notifications];
    const methods = updatedNotifications[index].methods;

    if (!checked && methods.length === 1) {
      return;
    }

    updatedNotifications[index].methods = checked
      ? [...methods, method]
      : methods.filter((m) => m !== method);

    setFormData((prevFormData) => ({
      ...prevFormData,
      notifications: updatedNotifications,
    }));
  };

  const addNotification = () => {
    const newNotification = {
      timeBefore: 0,
      methods: ["email"],
      isSent: false,
    };

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

  return (
    <div>
      <button
        type="button"
        className="form-button add-notification"
        onClick={addNotification}
      >
        Add
      </button>
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

          {/* Notification Methods */}
          <div>
            <label className="form-label">Methods:</label>
            <div className="notification-methods">
              {["email", "whatsapp"].map((method) => (
                <label
                  className="checkbox-label checkbox-label-small"
                  key={method}
                >
                  <input
                    type="checkbox"
                    checked={notif.methods.includes(method)}
                    onChange={(e) =>
                      handleMethodChange(index, method, e.target.checked)
                    }
                  />
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </label>
              ))}
            </div>
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
