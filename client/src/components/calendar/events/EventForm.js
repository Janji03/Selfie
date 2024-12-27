import React, { useState } from "react";
import RecurrenceForm from "./RecurrenceForm";
import TimeZoneForm from "../TimeZoneForm";

const EventForm = ({ initialData, onSubmit, isEditMode }) => {
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
      isPomodoro 
    } = formData;


    if (!title || title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Event title must be between 1 and ${MAX_TITLE_LENGTH} characters.`;
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
        adjustedFormData.endDate = formData.startDate; // Forza endDate uguale a startDate
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

  const handleResetChanges = () => {
    setFormData({ ...initialData });
  };


  // Funzione per calcolare le proposte di studio
  const calculateProposals = () => {
    const startTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endTime = new Date(`${formData.startDate}T${formData.endTime}`);
    const totalMinutes = Math.floor((endTime - startTime) / 60000); 

    const breakTime = Math.floor(totalMinutes * 0.2);
    const studyTime = totalMinutes - breakTime;
    return [
      { study: studyTime, break: breakTime, cycles: 1 },
      { study: Math.floor(studyTime / 2), break: breakTime, cycles: 2 },
      { study: Math.floor(studyTime / 3), break: breakTime, cycles: 3 },
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
              name="isPomodoro"
              checked={formData.isPomodoro}
              onChange={handleChange}
            />
            Is Pomodoro
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
            <div>
              <h3>Pomodoro Proposals</h3>
              {calculateProposals().map((proposal, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleProposalSelect(proposal)}
                >
                  Study: {proposal.study} min, Break: {proposal.break} min, Cycles:{" "} {proposal.cycles} <br/>
                </button>
              ))}
            </div>

            {/* Modifica manuale delle impostazioni Pomodoro */}
            <div>
              <label>Study Time (min):</label>
              <input
                type="number"
                name="studyTime"
                value={formData.pomodoroSettings.studyTime || ""}
                onChange={(e) =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    pomodoroSettings: {
                      ...prevFormData.pomodoroSettings,
                      studyTime: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <label>Break Time (min):</label>
              <input
                type="number"
                name="breakTime"
                value={formData.pomodoroSettings.breakTime || ""}
                onChange={(e) =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    pomodoroSettings: {
                      ...prevFormData.pomodoroSettings,
                      breakTime: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <label>Cycles:</label>
              <input
                type="number"
                name="cycles"
                value={formData.pomodoroSettings.cycles || ""}
                onChange={(e) =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    pomodoroSettings: {
                      ...prevFormData.pomodoroSettings,
                      cycles: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </>
        ) : (
          <>
            {/* Campi standard per eventi non Pomodoro */}
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
              <label>End Date:</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
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

            {!formData.allDay && (
              <>
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
              </>
            )}

            <div>
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
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

            <div>
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Time Zone:</label>
              <TimeZoneForm
                initialTimeZone={formData.timeZone}
                onSubmit={handleTimeZoneChange}
              />
            </div>
          </>
        )}

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
