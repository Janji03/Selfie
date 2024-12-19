import React, { useState } from "react";
import RecurrenceForm from "./RecurrenceForm";
import TimeZoneForm from "../TimeZoneForm";

const EventForm = ({ initialData, onSubmit, isEditMode }) => {
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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <span style={{ color: "red" }}>{errors.title}</span>}
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="allDay"
              checked={formData.allDay}
              onChange={handleChange}
            />
            All Day
          </label>
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>
        {!formData.allDay && (
          <div>
            <label>Start Time:</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
            />
          </div>
        )}
        <div>
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            style={{
              textDecoration:
                new Date(formData.endDate) < new Date(formData.startDate)
                  ? "line-through"
                  : "none",
            }}
          />
          {errors.endDate && (
            <span style={{ color: "red" }}>{errors.endDate}</span>
          )}
        </div>
        {!formData.allDay && (
          <div>
            <label>End Time:</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              style={{
                textDecoration:
                  formData.startDate === formData.endDate &&
                  formData.endTime <= formData.startTime
                    ? "line-through"
                    : "none",
              }}
            />

            {errors.endTime && (
              <span style={{ color: "red" }}>{errors.endTime}</span>
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
            />
            Is Recurring
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
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
          {errors.location && (
            <span style={{ color: "red" }}>{errors.location}</span>
          )}
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <span style={{ color: "red" }}>{errors.description}</span>
          )}
        </div>
        <div>
          <label>Time Zone:</label>
          <TimeZoneForm
            initialTimeZone={formData.timeZone}
            onSubmit={handleTimeZoneChange}
          />
        </div>
        <button type="submit">
          {isEditMode ? "Save Changes" : "Add Event"}
        </button>
        {isEditMode && (
          <button type="button" onClick={handleResetChanges}>
            Reset changes
          </button>
        )}
      </form>
    </div>
  );
};

export default EventForm;
