import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { getUser } from "../../../services/userService";
import { handleInvitationResponse } from "../../../services/taskService"; // Similar to eventService
import "../../../styles/TaskInfo.css";

const TaskInfo = ({
  selectedTask,
  handleEditTask,
  handleDeleteTask,
  markTaskAsCompleted,
}) => {
  const currentUserID = localStorage.getItem("userID");
  const isOwner = selectedTask.userID === currentUserID;

  const [ownerUser, setOwnerUser] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [currentUserStatus, setCurrentUserStatus] = useState("pending");

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        if (!isOwner) {
          const owner = await getUser(selectedTask.userID);
          setOwnerUser(owner);
        }

        if (selectedTask.extendedProps.invitedUsers?.length > 0) {
          const users = await Promise.all(
            selectedTask.extendedProps.invitedUsers.map(async (invite) => {
              const user = await getUser(invite.userID);
              if (invite.userID === currentUserID) {
                setCurrentUserStatus(invite.status);
              }
              return user
                ? {
                    id: invite.userID,
                    name: user.name,
                    email: user.email,
                    status: invite.status,
                  }
                : null;
            })
          );
          setParticipants(users.filter(Boolean));
        }
      } catch (error) {
        console.error("Failed to fetch task data:", error);
      }
    };

    fetchTaskData();
  }, [isOwner, selectedTask]);

  const isOverdue = selectedTask.extendedProps.isOverdue;
  const isCompleted = selectedTask.extendedProps.status === "completed";

  const completedAt = selectedTask.extendedProps.completedAt
    ? DateTime.fromISO(selectedTask.extendedProps.completedAt)
    : null;
  const deadline = DateTime.fromISO(selectedTask.extendedProps.deadline);
  const completedLate = isCompleted && completedAt && completedAt >= deadline;

  const isAllDay = selectedTask.extendedProps.isAllDay;

  const handleResponse = async (responseType) => {
    await handleInvitationResponse(selectedTask.id, currentUserID, responseType);
    setCurrentUserStatus(responseType === "accept" ? "accepted" : "rejected");
  };

  const getBadgeClass = () => {
    if (completedLate) return "late";
    if (isCompleted) return "completed";
    if (isOverdue) return "overdue";
    return "pending";
  };

  return (
    <div className="task-info">
      {/* Task Title */}
      <h2 className={getBadgeClass()}>{selectedTask.title}</h2>

      {/* Deadline */}
      <p>
        <strong>Deadline:</strong>{" "}
        {isAllDay
          ? deadline.toLocaleString(DateTime.DATE_SHORT)
          : deadline.toLocaleString(DateTime.DATETIME_FULL)}
      </p>

      {/* All Day Indicator */}
      {isAllDay && (
        <p className="all-day-indicator">
          <strong>All Day Task</strong>
        </p>
      )}

      {/* Overdue notifications */}
      <p>
        <strong>Overdue notifications:</strong>{" "}
        {selectedTask.extendedProps.notifications ? "enabled" : "disabled"}
      </p>

      {/* Time Zone */}
      {selectedTask.extendedProps?.timeZone && (
        <p>
          <strong>Time Zone:</strong> {selectedTask.extendedProps.timeZone}
        </p>
      )}

      {/* Owner Info */}
      {!isOwner && ownerUser && (
        <p>
          <strong>Task Owner: </strong>
          {ownerUser.name} ({ownerUser.email})
        </p>
      )}

      {/* Invited Users */}
      {participants.length > 0 && (
        <div className="invited-users-container">
          <h3>Invited Users:</h3>
          <ul>
            {participants.map((user, index) => (
              <li key={index} className="invited-user-item">
                <div className="user-details">
                  <strong>{user.name}</strong>
                  <div className="user-email">{user.email}</div>
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

      {/* Action Buttons */}
      <div className="action-buttons">
        {isOwner && (
          <>
            <button className="edit" onClick={handleEditTask}>
              Edit Task
            </button>
            <button className="delete" onClick={handleDeleteTask}>
              Delete Task
            </button>
          </>
        )}
        <button
          className={isCompleted ? "pending" : "completed"}
          onClick={markTaskAsCompleted}
        >
          {isCompleted ? "Mark as Pending" : "Mark as Completed"}
        </button>
      </div>
    </div>
  );
};

export default TaskInfo;
