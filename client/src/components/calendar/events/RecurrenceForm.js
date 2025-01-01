import { useEffect } from "react";
import RecurrenceHandler from "./RecurrenceHandler";

const RecurrenceForm = ({ formData, setFormData, handleChange }) => {
  const { calculateEndDateRecurrence } = RecurrenceHandler();

  useEffect(() => {
    if (formData.startDate && formData.recurrence.type) {
      const newEndDate = calculateEndDateRecurrence(
        formData.startDate,
        formData.recurrence.type === "CUSTOM"
          ? formData.recurrence.frequency
          : formData.recurrence.type
      );

      setFormData((prev) => ({
        ...prev,
        recurrence: {
          ...prev.recurrence,
          endDate: newEndDate,
        },
      }));
    }
  }, [
    formData.startDate,
    formData.recurrence.type,
    formData.recurrence.frequency,
    formData.recurrence.interval,
  ]);

  const dayMapping = {
    Sunday: "SU",
    Monday: "MO",
    Tuesday: "TU",
    Wednesday: "WE",
    Thursday: "TH",
    Friday: "FR",
    Saturday: "SA",
  };

  const handleRecurrenceToggle = (value, field) => {
    const toggleValue = field === "daysOfWeek" ? dayMapping[value] : value;
    const list = [...formData.recurrence[field]];

    if (list.includes(toggleValue)) {
      const updatedList = list.filter((item) => item !== toggleValue);

      if (updatedList.length === 0) {
        return;
      }

      setFormData((prev) => ({
        ...prev,
        recurrence: {
          ...prev.recurrence,
          [field]: updatedList,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        recurrence: {
          ...prev.recurrence,
          [field]: [...list, toggleValue],
        },
      }));
    }
  };

  const formatRecurrenceFrequency = (frequency, count) => {
    switch (frequency) {
      case "daily":
        return count > 1 ? " days" : " day";
      case "weekly":
        return count > 1 ? " weeks" : " week";
      case "monthly":
        return count > 1 ? " months" : " month";
      case "yearly":
        return count > 1 ? " years" : " year";
      default:
        return "";
    }
  };

  return (
    <div className="recurrence-container">
      <div>
        <label className="form-label">Recurrence:</label>
        <select
          className="form-input"
          name="recurrence.type"
          value={formData.recurrence.type}
          onChange={handleChange}
        >
          <option value="DAILY">Every Day</option>
          <option value="WEEKLY">Every Week</option>
          <option value="MONTHLY">Every Month</option>
          <option value="YEARLY">Every Year</option>
          <option value="CUSTOM">Custom</option>
        </select>
      </div>

      {formData.recurrence.type === "CUSTOM" && (
        <div>
          <div>
            <label className="form-label">Repeat:</label>
            <select
              className="form-input"
              name="recurrence.frequency"
              value={formData.recurrence.frequency}
              onChange={handleChange}
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
          <div>
            <label className="form-label">Every:</label>
            <input
              className="form-input"
              type="number"
              name="recurrence.interval"
              value={formData.recurrence.interval}
              onChange={handleChange}
              min="1"
            />
            <span>
              {formatRecurrenceFrequency(
                formData.recurrence.frequency,
                formData.recurrence.interval || 1
              )}
            </span>
          </div>
          {formData.recurrence.frequency === "WEEKLY" && (
            <div>
              <label className="form-label">On:</label>
              {[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((day) => (
                <div key={day}>
                  <label className="checkbox-label checkbox-label-small">
                    <input
                      type="checkbox"
                      checked={formData.recurrence.daysOfWeek.includes(
                        dayMapping[day]
                      )}
                      onChange={() => handleRecurrenceToggle(day, "daysOfWeek")}
                    />
                    {day}
                  </label>
                  <br />
                </div>
              ))}
            </div>
          )}
          {formData.recurrence.frequency === "MONTHLY" && (
            <div>
              <div>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="recurrence.monthlyType"
                    value="daysOfMonth"
                    checked={formData.recurrence.monthlyType === "daysOfMonth"}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        recurrence: {
                          ...formData.recurrence,
                          monthlyType: "daysOfMonth",
                        },
                      })
                    }
                  />
                  Each
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="recurrence.monthlyType"
                    value="weekdayOccurrences"
                    checked={
                      formData.recurrence.monthlyType === "weekdayOccurrences"
                    }
                    onChange={() =>
                      setFormData({
                        ...formData,
                        recurrence: {
                          ...formData.recurrence,
                          monthlyType: "weekdayOccurrences",
                        },
                      })
                    }
                  />
                  On the
                </label>
              </div>
              {formData.recurrence.monthlyType === "daysOfMonth" && (
                <div>
                  <label className="form-label">Select Day(s):</label>
                  <div className="form-month-days-container">
                    {[...Array(31)].map((_, dayIndex) => {
                      const day = dayIndex + 1;
                      const isSelected =
                        formData.recurrence.monthDays.includes(day);
                      return (
                        <div
                          key={day}
                          onClick={() =>
                            handleRecurrenceToggle(day, "monthDays")
                          }
                          className={`form-month-day ${
                            isSelected ? "selected" : "default"
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                  <br />
                </div>
              )}
              {formData.recurrence.monthlyType === "weekdayOccurrences" && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <select
                      className="form-input"
                      name="recurrence.ordinal"
                      value={formData.recurrence.ordinal}
                      onChange={handleChange}
                    >
                      <option value="+1">First</option>
                      <option value="+2">Second</option>
                      <option value="+3">Third</option>
                      <option value="+4">Fourth</option>
                      <option value="+5">Fifth</option>
                      <option value="-1">Last</option>
                    </select>
                    <select
                      className="form-input"
                      name="recurrence.dayOfWeek"
                      value={formData.recurrence.dayOfWeek}
                      onChange={handleChange}
                    >
                      <option value="sunday">Sunday</option>
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                      <option value="saturday">Saturday</option>
                      <option value="day">Day</option>
                      <option value="weekday">Weekday</option>
                      <option value="weekend">Weekend</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
          {formData.recurrence.frequency === "YEARLY" && (
            <div>
              <div>
                <label className="form-label">Select Month(s):</label>
                <div className="form-year-months-container">
                  {[
                    "JAN",
                    "FEB",
                    "MAR",
                    "APR",
                    "MAY",
                    "JUN",
                    "JUL",
                    "AUG",
                    "SEP",
                    "OCT",
                    "NOV",
                    "DEC",
                  ].map((month, monthIndex) => {
                    const isSelected = formData.recurrence.yearMonths.includes(
                      monthIndex + 1
                    );
                    return (
                      <div
                        key={month}
                        onClick={() =>
                          handleRecurrenceToggle(monthIndex + 1, "yearMonths")
                        }
                        className={`form-year-month ${
                          isSelected ? "selected" : "default"
                        }`}
                      >
                        {month}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="recurrence.triggerDaysOfWeek"
                    checked={formData.recurrence.triggerDaysOfWeek}
                    onChange={handleChange}
                  />
                  <span className="checkbox-label checkbox-label-small">Days of week</span>
                </label>
              </div>
              {formData.recurrence.triggerDaysOfWeek && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <select
                      className="form-input"
                      name="recurrence.ordinal"
                      value={formData.recurrence.ordinal}
                      onChange={handleChange}
                    >
                      <option value="+1">First</option>
                      <option value="+2">Second</option>
                      <option value="+3">Third</option>
                      <option value="+4">Fourth</option>
                      <option value="+5">Fifth</option>
                      <option value="-1">Last</option>
                    </select>
                    <select
                      className="form-input"
                      name="recurrence.dayOfWeek"
                      value={formData.recurrence.dayOfWeek}
                      onChange={handleChange}
                    >
                      <option value="sunday">Sunday</option>
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                      <option value="saturday">Saturday</option>
                      <option value="day">Day</option>
                      <option value="weekday">Weekday</option>
                      <option value="weekend">Weekend</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <div>
        <label className="form-label">End Repeat:</label>
        <select
          className="form-input"
          name="recurrence.endCondition"
          value={formData.recurrence.endCondition}
          onChange={handleChange}
        >
          <option value="never">Never</option>
          <option value="onDate">On Date</option>
          <option value="afterOccurrences">After X occurrences</option>
        </select>
      </div>
      {formData.recurrence.endCondition === "onDate" && (
        <div>
          <label className="form-label">End Date:</label>
          <input
            className="form-input"
            type="date"
            name="recurrence.endDate"
            value={formData.recurrence.endDate}
            onChange={handleChange}
          />
        </div>
      )}
      {formData.recurrence.endCondition === "afterOccurrences" && (
        <div>
          <label className="form-label">Occurrences:</label>
          <input
            className="form-input"
            type="number"
            name="recurrence.endOccurrences"
            value={formData.recurrence.endOccurrences}
            onChange={handleChange}
            min="1"
          />
        </div>
      )}
    </div>
  );
};

export default RecurrenceForm;
