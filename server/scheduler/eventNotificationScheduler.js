import User from "../models/User.js";

const scheduleEventNotifications = async (agenda, userID, event) => {
  try {

    if (!userID || !event || !event.extendedProps.notifications.length) {
      return;
    }

    const user = await User.findById(userID).select("-password");

    if (!user) {
      return;
    }

    const eventStartTime = new Date(event.start);

    for (let i = 0; i < event.extendedProps.notifications.length; i++) {
      const notification = event.extendedProps.notifications[i];
      const notificationTime = new Date(
        eventStartTime.getTime() - notification.timeBefore * 60 * 1000
      );

      if (!notification.isSent) {
        await agenda.schedule(notificationTime, "event-notification", {
          event,
          notificationIndex: i,
          userEmail: user.email,
          // phoneNumber: user.phoneNumber,
        });
      }
    }
  } catch (err) {
    console.error("Error scheduling event notifications:", err);
  }
};

export default scheduleEventNotifications;