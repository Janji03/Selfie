import {
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../../../services/taskService";

import DateUtilities from "../DateUtilities";

import { v4 as uuidv4 } from "uuid";
import { DateTime } from "luxon";

const TaskHandler = ({
  userID,
  tasks,
  setTasks,
  selectedTask,
  setSelectedTask,
  isEditMode,
  setIsEditMode,
  setIsFormOpen,
  setTaskFormInitialData,
  time,
  isTimeMachineActive,
  calendarTimeZone,
}) => {
  const { addThirtyMinutes, convertEventTimes } = DateUtilities({ calendarTimeZone });

  const handleTaskClick = async (clickedItemId) => {
    try {
      let clickedTask;

      if (isTimeMachineActive) {
        clickedTask = tasks.find((task) => task.id === clickedItemId);
        if (!clickedTask) {
          console.error("Task not found in local state.");
        }
      } else {
        clickedTask = await getTaskById(clickedItemId);
      }
      setSelectedTask(clickedTask);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  const handleEditTask = () => {
    if (selectedTask) {
      setTaskFormInitialData({
        title: selectedTask.title,
        deadlineDate: DateTime.fromISO(selectedTask.start, { zone: "UTC" })
          .setZone(calendarTimeZone)
          .toISO()
          .split("T")[0],
        deadlineTime: DateTime.fromISO(selectedTask.start, { zone: "UTC" })
          .setZone(calendarTimeZone)
          .toISO()
          .split("T")[1]
          .slice(0, 5),
        allDay: selectedTask.allDay,
        notifications: selectedTask.extendedProps.notifications,
        timeZone: selectedTask.extendedProps.timeZone,
        invitedUsers: selectedTask.extendedProps.invitedUsers
      });
      setIsEditMode(true);
      setIsFormOpen(true);
    }
  };

  const handleDeleteTask = async () => {
    if (selectedTask) {
      try {
        await deleteTask(selectedTask.id);
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== selectedTask.id)
        );

        setSelectedTask(null);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleTaskFormSubmit = async (data) => {
    const taskTimeZone = data.timeZone;

    
    const now = new Date(time);
    const nowDate = now.toISOString().split("T")[0];
    const nowTime = now.toISOString().split("T")[1].slice(0, 5);
    const nowDateTime = `${nowDate}T${nowTime}:00Z`;
    
    const isAllDay = data.allDay;
    
    const deadlineDate = data.deadlineDate;
    const deadlineTime = data.deadlineTime;
    const deadlineDateTime = `${deadlineDate}T${deadlineTime}:00`;
    const deadlineEndDateTime = `${addThirtyMinutes(deadlineDateTime)}`;

    const deadline = isAllDay ? deadlineDate : deadlineDateTime;
    const endDeadline = isAllDay ? deadlineDate : deadlineEndDateTime;

    const current = isAllDay ? nowDate : nowDateTime;

    const isOverdue = deadline <= current;

    const utcDeadline = DateTime.fromISO(deadline, { zone: taskTimeZone }).toUTC().toISO();
    const utcEndDeadline = DateTime.fromISO(endDeadline, { zone: taskTimeZone }).toUTC().toISO();
    const utcCurrent = DateTime.fromISO(current, { zone: taskTimeZone }).toUTC().toISO();
    const utcEndCurrent = DateTime.fromISO(addThirtyMinutes(current), { zone: taskTimeZone }).toUTC().toISO();

    const newTask = {
      id: uuidv4(),
      title: data.title,
      start: isOverdue ? utcCurrent  : utcDeadline,
      end: isOverdue ? utcEndCurrent  : utcEndDeadline,
      allDay: isAllDay,
      extendedProps: {
        status: "pending",
        isOverdue: isOverdue,
        deadline,
        notifications: data.notifications,
        timeZone: data.timeZone,
        invitedUsers: data.invitedUsers,
      },
    };

    try {
      if (isEditMode) {
        const updatedTask = await updateTask(selectedTask.id, newTask);

        // Convert the updated task from UTC to Local Timezone
        const convertedTask = convertEventTimes(updatedTask);

        const updatedTasks = tasks.map((task) =>
          task.id === selectedTask.id ? { ...task, ...convertedTask } : task
        );

        setTasks(updatedTasks);
        setSelectedTask(updatedTask);
      } else {
        const createdTask = await createTask(newTask, userID);

        // Convert the updated task from UTC to Local Timezone
        const convertedTask = convertEventTimes(createdTask);

        setTasks([...tasks, convertedTask]);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const initializeTaskForm = (startDateTime) => {
    const startTime = startDateTime.includes("T")
      ? startDateTime.split("T")[1].slice(0, 5)
      : "00:00";
    setTaskFormInitialData({
      title: "",
      deadlineDate: startDateTime.split("T")[0],
      deadlineTime: startTime,
      allDay: false,
      notifications: false,
      timeZone: calendarTimeZone,
      invitedUsers: [],
    });
  };

  const markTaskAsCompleted = async () => {
    if (selectedTask) {
      const currentStatus = selectedTask.extendedProps.status;
      const updatedStatus =
        currentStatus === "completed" ? "pending" : "completed";

      const now = new Date(time);
      const nowDate = now.toISOString().split("T")[0];
      const nowTime = now.toISOString().split("T")[1].slice(0, 5);
      const nowDateTime = `${nowDate}T${nowTime}`;
      const current = selectedTask.isAllDay ? nowDate : nowDateTime;

      const updatedIsOverdue =
        updatedStatus === "completed"
          ? false
          : selectedTask.extendedProps.deadline <= current;
      
      const updatedCompletedAt =
      updatedStatus === "completed"
        ? nowDateTime
        : null;

      const updatedTask = {
        ...selectedTask,
        extendedProps: {
          ...selectedTask.extendedProps,
          status: updatedStatus,
          isOverdue: updatedIsOverdue,
          completedAt: updatedCompletedAt,
        },
      };
      try {
        const newTask = await updateTask(selectedTask.id, updatedTask);
        const updatedTasks = tasks.map((task) =>
          task.id === selectedTask.id ? { ...task, ...newTask } : task
        );

        setTasks(updatedTasks);

        setSelectedTask(updatedTask);
      } catch (error) {
        console.error("Error marking task as completed:", error);
      }
    }
  };

  const checkForOverdueTasks = async () => {
    const now = new Date(time);
    const nowDate = now.toISOString().split("T")[0];
    const nowTime = now.toISOString().split("T")[1].slice(0, 5);
    const nowDateTime = `${nowDate}T${nowTime}:00Z`;

    const updatedTasks = tasks.map((task) => {
      const taskDeadline = task.extendedProps.deadline.slice(0, 16);
      const isAllDay = task.isAllDay;

      const current = isAllDay ? nowDate : nowDateTime;
      const currentEnd = isAllDay ? nowDate : `${addThirtyMinutes(nowDateTime)}`;

      const isOverdue = taskDeadline <= current;

      if (isOverdue && task.extendedProps.status !== "completed") {
        return {
          ...task,
          extendedProps: {
            ...task.extendedProps,
            isOverdue: true,
          },
          start: current,
          end: currentEnd,
        };
      } else if (!isOverdue && task.extendedProps.isOverdue) {
        const startDeadline = new Date(taskDeadline);
        const endDeadline = new Date(startDeadline.getTime() + 30 * 60 * 1000);

        const taskStartDeadline = startDeadline.toISOString().slice(0, 16);
        const taskEndDeadline = endDeadline.toISOString().slice(0, 16);

        return {
          ...task,
          extendedProps: {
            ...task.extendedProps,
            isOverdue: false,
          },
          start: isAllDay ? taskDeadline.split("T")[0] : taskStartDeadline,
          end: isAllDay ? taskDeadline.split("T")[0] : taskEndDeadline,
        };
      }

      return { ...task };
    });

    setTasks(updatedTasks);
    if (isTimeMachineActive) {
      await Promise.all(
        updatedTasks.map((task) =>
          createTask({ ...task, extendedProps: { ...task.extendedProps, temporary: true }, _id: undefined, id: uuidv4() }, userID)
        ));  
    }
  };

  return {
    handleTaskClick,
    handleEditTask,
    handleDeleteTask,
    handleTaskFormSubmit,
    initializeTaskForm,
    markTaskAsCompleted,
    checkForOverdueTasks,
  };
};

export default TaskHandler;
