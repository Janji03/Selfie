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
  currentTime,
  isTimeUpdated,
  calendarTimeZone,
}) => {

  const {
    addThirtyMinutes
  } = DateUtilities( { calendarTimeZone });

  const handleTaskClick = async (clickedItemId) => {
    try {
      const clickedTask = await getTaskById(clickedItemId);
      setSelectedTask(clickedTask);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  }

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
        timeZone: selectedTask.extendedProps.timeZone,
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
    const today = new Date();
    const todayDate = today.toISOString().split("T")[0];
    const todayTime = today.toISOString().split("T")[1].slice(0, 5);
    const todayDateTime = `${todayDate}T${todayTime}`; 

    const deadline = data.allDay ? `${data.deadlineDate}T00:00:00`: `${data.deadlineDate}T${data.deadlineTime}`;
    const endDeadline = data.allDay ? `${data.deadlineDate}T00:00:00`: `${data.deadlineDate}T${addThirtyMinutes(data.deadlineTime)}`; 

    const isPastDeadline = deadline < todayDateTime;

    const newTask = {
      id: uuidv4(),
      title: data.title,
      start: isPastDeadline ? todayDate : deadline,
      end: isPastDeadline ? todayDate : endDeadline,
      allDay: isPastDeadline ? true : data.allDay,
      duration: data.allDay ? "24:00" : "00:30", 
      extendedProps: {
        status: "pending",
        isOverdue: isPastDeadline, 
        deadline,
        wasAllDay: data.allDay,
        timeZone: data.timeZone,
      },
    };
    try {
      if (isEditMode) {
        const updatedTask = await updateTask(selectedTask.id, newTask);
        const updatedTasks = tasks.map((task) =>
          task.id === selectedTask.id ? { ...task, ...updatedTask } : task
        );
        setTasks(updatedTasks);
        setSelectedTask(updatedTask);
      } else {
        const createdTask = await createTask(newTask, userID);
        setTasks([...tasks, createdTask]);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const initializeTaskForm = (startDateTime) => {
    const startTime = startDateTime.includes("T") ? startDateTime.split("T")[1].slice(0, 5) : "00:00";
    setTaskFormInitialData({
      title: "",
      deadlineDate: startDateTime.split("T")[0],
      deadlineTime: startTime,
      allDay: false,
      timeZone: calendarTimeZone,
    });
  };

  const markTaskAsCompleted = async () => {
    if (selectedTask) {

      const currentStatus = selectedTask.extendedProps.status;

      const newStatus = currentStatus === "completed" ? "pending" : "completed";

      const today = new Date().toISOString(); 
      const newIsOverdue = newStatus === "completed" ? false : selectedTask.extendedProps.deadline < today;
      
      const updatedTask = { 
        ...selectedTask, 
        extendedProps: { 
          ...selectedTask.extendedProps, 
          status: newStatus, 
          isOverdue: newIsOverdue 
        }
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
    const today = new Date(currentTime).toISOString(); 
    
    const updatedTasks = tasks.map((task) => {
      const taskDeadline = task.extendedProps.deadline;  

      if (taskDeadline < today && task.extendedProps.status !== "completed") {
        return {
          ...task,
          extendedProps: {
              ...task.extendedProps,
              isOverdue: true,
          },
          start: today,  
          end: today,    
          allDay: true,
        };
      } else if (taskDeadline >= today && task.extendedProps.isOverdue) {
        const wasAllDay = task.extendedProps.wasAllDay;
        const startDateTime = new Date(taskDeadline);
        const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000);
        return {
          ...task,
          extendedProps: {
            ...task.extendedProps,
            isOverdue: false,
          },
          start: wasAllDay ? `${taskDeadline.split("T")[0]}T00:00:00` : startDateTime.toISOString(),
          end: wasAllDay ? `${taskDeadline.split("T")[0]}T00:00:00` : endDateTime.toISOString(),
          allDay: wasAllDay,
        };
      }

      return { ...task };  
    });
    
    if (isTimeUpdated) {
      setTasks(updatedTasks);
    } else {
      await Promise.all(updatedTasks.map((task) => updateTask(task.id, task)));  
      setTasks(updatedTasks);  
    } 
  };

  return {
    handleTaskClick,
    handleEditTask,
    handleDeleteTask,
    handleTaskFormSubmit,
    initializeTaskForm,
    markTaskAsCompleted,
    checkForOverdueTasks
  };
};

export default TaskHandler;
