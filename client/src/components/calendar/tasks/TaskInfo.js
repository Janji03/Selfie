import { DateTime } from "luxon";

const TaskInfo = ({
    selectedTask,
    handleEditTask,
    handleDeleteTask,
    markTaskAsCompleted,
  }) => {
    if (!selectedTask) {
      return <div>Select a task to view its details</div>;
    }
  
    const getTaskStyles = (status, isOverdue) => {
      if (isOverdue && status === "pending") {
        return {
          backgroundColor: "#ffe0e0", // light red background for overdue
          color: "#d32f2f", // red text
          border: "2px solid #d32f2f",
        };
      }
      switch (status) {
        case "completed":
          return {
            backgroundColor: "#e0f7e4", // light green background
            color: "#2c7a2c", // green text
            border: "2px solid #2c7a2c",
          };
        case "pending":
          return {
            backgroundColor: "#e0efff", // light blue background
            color: "#1f5ba1", // blue text
            border: "2px solid #1f5ba1",
          };
        default:
          return {};
      }
    };
  
    const taskStatusStyle = getTaskStyles(
      selectedTask.extendedProps.status,
      selectedTask.extendedProps.isOverdue
    );

    const deadlineDate = DateTime.fromISO(selectedTask.extendedProps.deadline, { zone: "UTC" }).setZone(selectedTask.extendedProps.timeZone).toISO().split("T")[0];
    const deadlineTime = DateTime.fromISO(selectedTask.extendedProps.deadline, { zone: "UTC" }).setZone(selectedTask.extendedProps.timeZone).toISO().split("T")[1].slice(0, 5);

    return (
      <div style={{ padding: "20px", borderRadius: "10px", ...taskStatusStyle }}>
        {/* Task Title */}
        <h2 style={{ fontWeight: "bold", textAlign: "center" }}>{selectedTask.title}</h2>
  
        {/* Deadline Date */}
        <p>
            <strong>Deadline Date:</strong> {deadlineDate}
        </p>

        {/* Deadline Date Time*/}
        {!selectedTask.allDay && (
            <p>
                <strong>Deadline Time:</strong> {deadlineTime}
            </p>
        )}

        {/* All Day Event Indicator */}
        {selectedTask.allDay && <p><strong>All Day Task</strong></p>}
  
        {/* Task Completion Status */}
        <p>
          <strong>Status:</strong>{" "}
          {selectedTask.extendedProps.status.charAt(0).toUpperCase() +
            selectedTask.extendedProps.status.slice(1)}
        </p>
  
        {/* Overdue Indicator */}
        {selectedTask.extendedProps.isOverdue && (
          <p style={{ color: "#d32f2f", fontWeight: "bold" }}>This task is overdue!</p>
        )}
  
        {/* Time Zone */}
        {selectedTask.extendedProps?.timeZone && (
          <p>
            <strong>Time Zone:</strong> {selectedTask.extendedProps.timeZone}
          </p>
        )}
  
        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
          {/* Delete Task Button */}
          <button
            style={{
              backgroundColor: "#d32f2f", 
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={handleDeleteTask}
          >
            Delete Task
          </button>
  
          {/* Mark as Completed/Pending Button */}
          <button
            style={{
              backgroundColor:
                selectedTask.extendedProps.status === "completed" ? "#ffa726" : "#66bb6a", 
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={markTaskAsCompleted}
          >
            {selectedTask.extendedProps.status === "completed"
              ? "Mark as Pending"
              : "Mark as Completed"}
          </button>
  
          {/* Edit Task Button */}
          <button
            style={{
              backgroundColor: "#1f5ba1", 
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={handleEditTask}
          >
            Edit Task
          </button>
        </div>
      </div>
    );
  };
  
  export default TaskInfo;
  