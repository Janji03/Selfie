import React, { useState } from "react";
import { useTimeMachine } from "../../../context/TimeMachineContext";
import RecurrenceForm from "./RecurrenceForm";
import NotificationForm from "./NotificationForm";
import UserForm from "../UserForm";
import TimeZoneForm from "../TimeZoneForm";
import "../../../styles/Form.css";

const EventForm = ({ initialData, onSubmit, isEditMode }) => {
  const { time } = useTimeMachine();
  const [areProposalsOpen, setAreProposalsOpen] = useState(false);

  const [formData, setFormData] = useState({
    ...initialData,
    isPomodoro: false,
    pomodoroSettings: {
      studyTime: null,
      breakTime: null,
      cycles: null,
      completedCycles: null,
    },
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
      isPomodoro,
    } = formData;

    if (title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Event title can only be max ${MAX_TITLE_LENGTH} characters.`;
    }

    if (isPomodoro) {
      const { studyTime, breakTime, cycles } = formData.pomodoroSettings;
      if (!studyTime || !breakTime || !cycles) {
        newErrors.pomodoroSettings =
          "Study time, break time, and cycles are required for Pomodoro.";
      }
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

      // Logica specifica per eventi Pomodoro
      if (adjustedFormData.isPomodoro) {
        adjustedFormData.pomodoroSettings.completedCycles = 0;
      }

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

      if (adjustedFormData.isPomodoro) {
        adjustedFormData.pomodoroSettings = { ...formData.pomodoroSettings };
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

  const handleChangePomodoroSettings = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      const updatedPomodoroSettings = {
        ...prevFormData.pomodoroSettings,
        [name]: value,
      };

      const { studyTime, breakTime, cycles } = updatedPomodoroSettings;

      const study = parseInt(studyTime, 10) || 0;
      const breakDuration = parseInt(breakTime, 10) || 0;
      const cycleCount = parseInt(cycles, 10) || 0;

      const [startHours, startMinutes] = formData.startTime
        .split(":")
        .map((value) => parseInt(value, 10));

      const totalMinutesToAdd = (study + breakDuration) * cycleCount;

      const newTotalMinutes = startMinutes + totalMinutesToAdd;
      const endHours = (startHours + Math.floor(newTotalMinutes / 60)) % 24;
      const endMinutes = newTotalMinutes % 60;

      const formattedEndTime = `${endHours
        .toString()
        .padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;

      return {
        //capisci ben perchè
        ...prevFormData,
        pomodoroSettings: updatedPomodoroSettings,
        endTime: formattedEndTime,
      };
    });
  };

  const handleResetChanges = () => {
    setFormData({ ...initialData });
  };

  // Funzione per calcolare le proposte di studio
  const calculateProposals = () => {
    const startTime = new Date(`${formData.startDate}T${formData.startTime}`);
    let endTime = new Date(`${formData.startDate}T${formData.endTime}`);

    if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }
    const totalMinutes = Math.floor((endTime - startTime) / 60000);

    const breakTime = Math.floor(totalMinutes * 0.2);
    const studyTime = totalMinutes - breakTime;
    return [
      { study: studyTime, break: breakTime, cycles: 1 },
      {
        study: Math.floor(studyTime / 2),
        break: Math.floor(breakTime / 2),
        cycles: 2,
      },
      {
        study: Math.floor(studyTime / 3),
        break: Math.floor(breakTime / 3),
        cycles: 3,
      },
    ];
  };

  // Funzione per selezionare una proposta Pomodoro
  const handleProposalSelect = (proposal) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      pomodoroSettings: {
        studyTime: proposal.study,
        breakTime: proposal.break,
        cycles: proposal.cycles,
      },
    }));
    console.log(formData);
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
              name="isPomodoro"
              checked={formData.isPomodoro}
              onChange={handleChange}
              className="checkbox-input"
            />
            <span className="checkbox-label">Is Pomodoro</span>
          </label>
        </div>

        {formData.isPomodoro ? (
          <>
            {/* Campi specifici per il Pomodoro */}
            <div>
              <label>Start Date:</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Start Time:</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>End Time:</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>

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



            {/* Sezione Proposte Pomodoro */}
            <div className="form-proposal-event">
              <div className="form-proposal-heading">
                <h3>Pomodoro Proposals</h3>
                {areProposalsOpen ? 
                  (<i class="bi bi-pencil-fill" onClick={() => setAreProposalsOpen(false)}></i>
                ) : (
                  <i class="bi bi-collection-play" onClick={() => setAreProposalsOpen(true)}></i>
                )}
                 
              </div> 
            {areProposalsOpen ? (
              calculateProposals().map((proposal, index) => (
                <button
                  className="proposal-button"
                  key={index}
                  type="button"
                  onClick={() => handleProposalSelect(proposal)}
                >
                  <strong>Study</strong>: {proposal.study} min, <strong>Break</strong>: {proposal.break} min, <strong>Cycles</strong>: {proposal.cycles} <br />
                </button>
              ))
            ) : (
              <>
                {/* Modifica manuale delle impostazioni Pomodoro */}
                <div>
                  <label>Study Time (min):</label>
                  <input
                    type="number"
                    name="studyTime"
                    value={formData.pomodoroSettings.studyTime || ""}
                    onChange={handleChangePomodoroSettings}
                  />
                </div>

                <div>
                  <label>Break Time (min):</label>
                  <input
                    type="number"
                    name="breakTime"
                    value={formData.pomodoroSettings.breakTime || ""}
                    onChange={handleChangePomodoroSettings}
                  />
                </div>

                <div>
                  <label>Cycles:</label>
                  <input
                    type="number"
                    name="cycles"
                    value={formData.pomodoroSettings.cycles || ""}
                    onChange={handleChangePomodoroSettings}
                  />
                </div>
              </>
            )}
          </div>

            
            
          </>
        ) : (
          <div>
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
                    formData.endDate < formData.startDate
                      ? "line-through"
                      : "none",
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
          </div>
        )}

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
