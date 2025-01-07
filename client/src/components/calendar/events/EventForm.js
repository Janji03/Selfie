import React, { useState } from "react";
import { useTimeMachine } from "../../../context/TimeMachineContext";
import RecurrenceForm from "./RecurrenceForm";
import NotificationForm from "./NotificationForm";
import UserForm from "../UserForm"
import TimeZoneForm from "../TimeZoneForm";
import "../../../styles/Form.css";

const EventForm = ({ initialData, onSubmit, isEditMode }) => {
  const { time } = useTimeMachine();

  const [formData, setFormData] = useState({
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  const MAX_DATE_RANGE_DAYS = 300;
  const MAX_TITLE_LENGTH = 50;
  const MAX_LOCATION_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 200;

  const validateForm = () => {
    const newErrors = {};
    const {
      title,
      startDate,
      startTime,
      endDate,
      endTime,
      allDay,
      location,
      description,
    } = formData;

    if (title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Event title can be max ${MAX_TITLE_LENGTH} characters.`;
    }

    if (location.length > MAX_LOCATION_LENGTH) {
      newErrors.location = `Event location can be max ${MAX_LOCATION_LENGTH} characters.`;
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `Event description can be max ${MAX_DESCRIPTION_LENGTH} characters.`;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = "End date must be after start date.";
    }

    const timeDifference = endDateTime - startDateTime;
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    if (daysDifference > MAX_DATE_RANGE_DAYS) {
      newErrors.endDate = `Event cannot last more than ${MAX_DATE_RANGE_DAYS} days.`;
    }

    if (!allDay && startDate === endDate && startDateTime >= endDateTime) {
      newErrors.endTime = "End time must be after start time.";
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
        adjustedFormData.title = "New Event";
      }

      if (adjustedFormData.allDay) {
        const endDate = new Date(adjustedFormData.endDate);
        endDate.setDate(endDate.getDate() + 1);
        adjustedFormData.endDate = endDate.toISOString().split("T")[0];
        adjustedFormData.endTime = "00:00";
      }

      if (!adjustedFormData.isRecurring) {
        adjustedFormData.recurrence = null;
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
    const [mainKey, subKey] = name.split(".");

    if (subKey) {
      setFormData({
        ...formData,
        [mainKey]: {
          ...formData[mainKey],
          [subKey]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }

    if (name === "startDate") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        endDate: value,
      }));
    }

      if (name === "startTime") {
      const [hours, minutes] = value.split(":").map(Number);
      const newHours = (hours + 1) % 24;
      const updatedValue = `${newHours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;
  
        setFormData((prevFormData) => ({
          ...prevFormData,
        endTime: updatedValue,
        }));
      }
  };

  const handleResetChanges = () => {
    setFormData({ ...initialData });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
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
        <div>
          <label className="form-label">Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="form-input"
            min={new Date(time).toISOString().split("T")[0]}
          />
        </div>
        {!formData.allDay && (
          <div>
            <label className="form-label">Start Time:</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime || "00:00"}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        )}
        <div>
          <label className="form-label">End Date:</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="form-input"
            style={{
              textDecoration:
                formData.endDate < formData.startDate ? "line-through" : "none",
            }}
          />
          {errors.endDate && (
            <span className="error-message">{errors.endDate}</span>
          )}
        </div>
        {!formData.allDay && (
          <div>
            <label className="form-label">End Time:</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime || "00:00"}
              onChange={handleChange}
              className="form-input"
              style={{
                textDecoration:
                  formData.startDate === formData.endDate &&
                  formData.endTime <= formData.startTime
                    ? "line-through"
                    : "none",
              }}
            />
            {errors.endTime && (
              <span className="error-message">{errors.endTime}</span>
            )}
          </div>
        )}
        <div>
          <label>
            <input
              type="checkbox"
              name="isRecurring"
              checked={formData.isRecurring}
              onChange={handleChange}
              className="checkbox-input"
            />
            <span className="checkbox-label">Is Recurring</span>
          </label>
        </div>
        {formData.isRecurring && (
          <RecurrenceForm
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
          />
        )}
        <div>
          <label className="form-label">Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-input"
          />
          {errors.location && (
            <span className="error-message">{errors.location}</span>
          )}
        </div>
        <div>
          <label className="form-label">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
        </div>
        <label className="form-label">Notifications</label>
        <NotificationForm formData={formData} setFormData={setFormData} />

        <label className="form-label">Invite users</label>
        <UserForm formData={formData} setFormData={setFormData} />
        
        <div>
          <label className="form-label">Time Zone:</label>
          <TimeZoneForm
            initialTimeZone={formData.timeZone}
            onSubmit={handleTimeZoneChange}
          />
        </div>
        <button type="submit" className="form-button form-submit">
          {isEditMode ? "Save Changes" : "Add Event"}
        </button>
        {isEditMode && (
          <button
            type="button"
            onClick={handleResetChanges}
            className="form-button form-reset"
          >
            Reset Changes
          </button>
        )}
      </form>
    </div>
  );
};

export default EventForm;
