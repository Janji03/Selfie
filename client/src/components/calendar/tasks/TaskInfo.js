import { DateTime } from "luxon";
import "../../../styles/TaskInfo.css";

const TaskInfo = ({
  selectedTask,
  handleEditTask,
  handleDeleteTask,
  markTaskAsCompleted,
}) => {

  const isOverdue = selectedTask.extendedProps.isOverdue;
  const isCompleted = selectedTask.extendedProps.status === "completed";

  // Check if the task was completed after the deadline
  const completedAt = selectedTask.extendedProps.completedAt
    ? DateTime.fromISO(selectedTask.extendedProps.completedAt)
    : null;
  const deadline = DateTime.fromISO(selectedTask.extendedProps.deadline);
  const completedLate = isCompleted && completedAt && completedAt >= deadline;

  const isAllDay = selectedTask.extendedProps.isAllDay;

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
          <strong>Overdue notifications:</strong> 
          {selectedTask.extendedProps.notifications ? " enabled" : " disabled"}
        </p>

      {/* Time Zone */}
      {selectedTask.extendedProps?.timeZone && (
        <p>
          <strong>Time Zone:</strong> {selectedTask.extendedProps.timeZone}
        </p>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="edit" onClick={handleEditTask}>
          Edit Task
        </button>

        <button
          className={isCompleted ? "pending" : "completed"}
          onClick={markTaskAsCompleted}
        >
          {isCompleted ? "Mark as Pending" : "Mark as Completed"}
        </button>
        <button className="delete" onClick={handleDeleteTask}>
          Delete Task
        </button>
      </div>
    </div>
  );
};

export default TaskInfo;
