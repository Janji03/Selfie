import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { RRule, rrulestr } from "rrule";
import { Link } from "react-router-dom";

import "../../../styles/EventInfo.css";
import RecurrenceHandler from "./RecurrenceHandler";
import { getUser } from "../../../services/userService";
import { handleInvitationResponse } from "../../../services/eventService";
import "../../../styles/EventInfo.css";

const EventInfo = ({
  selectedEvent,
  setSelectedEvent,
  setEvents,
  selectedOccurrence,
  handleEditEvent,
  handleDeleteEvent,
  handleExportEvent,
}) => {
  const { getRecurrenceSummary } = RecurrenceHandler();

  const { id, userID, title, start, end, allDay, rrule, extendedProps } =
    selectedEvent;
  const { location, description, timeZone, notifications, invitedUsers } =
    extendedProps;

  const currentUserID = localStorage.getItem("userID");
  const isOwner = userID === currentUserID;

  const [ownerUser, setOwnerUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [currentUserStatus, setCurrentUserStatus] = useState("pending");

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        if (!isOwner) {
          const owner = await getUser(userID);
          setOwnerUser(owner);
        }

        const user = getUser(currentUserID);
        setCurrentUser(user);

        if (invitedUsers && invitedUsers.length > 0) {
          const users = await Promise.all(
            invitedUsers.map(async (invite) => {
              const participant = await getUser(invite.userID);
              if (invite.userID === currentUserID) {
                setCurrentUserStatus(invite.status);
              }
              return participant
                ? {
                    id: invite.userID,
                    name: participant.name,
                    email: participant.email,
                    status: invite.status,
                  }
                : null;
            })
          );
          setParticipants(users.filter(Boolean));
        }
      } catch (error) {
        console.error("Failed to fetch participants:", error);
      }
    };

    fetchParticipants();
  }, []);

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

  const handleResponse = async (responseType) => {
    await handleInvitationResponse(id, currentUserID, responseType);
    setCurrentUserStatus(responseType === "accept" ? "accepted" : "rejected");

    if (responseType === "reject") {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== selectedEvent.id)
      );
      setSelectedEvent(null);
    }
  };

  return (
    <div className="event-info">
      <h2 className={`${isOwner ? "" : "invited"}`}>{title}</h2>

      <p>
        <strong>Start:</strong>{" "}
        {allDay
          ? DateTime.fromISO(start, { zone: "UTC" })
              .setZone(timeZone)
              .toLocaleString(DateTime.DATE_SHORT)
          : DateTime.fromISO(start, { zone: "UTC" })
              .setZone(timeZone)
              .toLocaleString(DateTime.DATETIME_FULL)}
      </p>
      <p>
        <strong>End:</strong>{" "}
        {allDay
          ? DateTime.fromISO(end, { zone: "UTC" })
              .setZone(timeZone)
              .toLocaleString(DateTime.DATE_SHORT)
          : DateTime.fromISO(end, { zone: "UTC" })
              .setZone(timeZone)
              .toLocaleString(DateTime.DATETIME_FULL)}
      </p>

      {allDay && (
        <p className="all-day-indicator">
          <strong>All Day Event</strong>
        </p>
      )}

      {location && (
        <p className="location">
          <strong>Location:</strong> {location}
        </p>
      )}

      {description && (
        <p className="description">
          <strong>Description:</strong> {description}
        </p>
      )}

      {rrule && (
        <p className="recurrence">
          <strong>Repeats:</strong> {getRecurrenceSummary(rrule)}
        </p>
      )}

      {notifications.length > 0 && (
        <div className="notifications-container">
          <h3>Notifications:</h3>
          <ul>
            {notifications.map((notification, index) => (
              <li key={index} className="notification">
                <strong>{timeOptions[notification.timeBefore]}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      {timeZone && (
        <p className="timezone">
          <strong>Time Zone:</strong> {timeZone}
        </p>
      )}

      {!isOwner && ownerUser && (
        <div className="owner-info">
          <p>
            <strong>Event Owner: </strong>
            {ownerUser.name} ({ownerUser.email})
          </p>
        </div>
      )}

      {invitedUsers.length > 0 && (
        <div className="invited-users-container">
          <h3>Invited Users:</h3>
          <ul>
            {participants.map((user, index) => (
              <li key={index} className="invited-user-item">
                <div className="user-details">
                  <div>
                    <strong>{user.name}</strong>
                    <div className="user-email">{user.email}</div>{" "}
                  </div>
                </div>
                {user.id === currentUserID ? (
                  <div className="response-buttons">
                    {currentUserStatus === "pending" ? (
                      <>
                        <button
                          className="accept"
                          onClick={() => handleResponse("accept")}
                          title="Accept"
                        >
                          ✔️
                        </button>
                        <button
                          className="reject"
                          onClick={() => handleResponse("reject")}
                          title="Reject"
                        >
                          ❌
                        </button>
                      </>
                    ) : (
                      <div
                        className={`status ${currentUserStatus.toLowerCase()}`}
                      >
                        {currentUserStatus}
                      </div>
                    )}
                    {currentUserStatus === "accepted" && (
                      <button
                        className="leave"
                        onClick={() => handleResponse("reject")}
                      >
                        Leave
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={`status ${user.status.toLowerCase()}`}>
                    {user.status}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="action-buttons">
        {isOwner && (
          <>
            <button className="edit" onClick={handleEditEvent}>
              Edit Event
            </button>
            <button className="delete" onClick={() => handleDeleteEvent(null)}>
              Delete Event
            </button>
            {selectedEvent.rrule && (
              <button
                className="delete-single"
                onClick={() => handleDeleteEvent(selectedOccurrence)}
              >
                Delete Single Instance
              </button>
            )}
          </>
        )}
        <button className="export" onClick={handleExportEvent}>
          Export Event
        </button>

        {selectedEvent.extendedProps.isPomodoro && (
          <div>
            <button className="go-to-pomodoro">
              <Link
                to="/pomodoro"
                state={{
                  id: selectedEvent.id,
                  title: selectedEvent.title,
                  pomodoroSettings:
                    selectedEvent.extendedProps.pomodoroSettings,
                  selectedEvent: selectedEvent,
                }}
              >
                Vai al Pomodoro
              </Link>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventInfo;
