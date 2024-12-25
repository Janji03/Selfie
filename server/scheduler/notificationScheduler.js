import agenda from '../config/agendaConfig.js';
import notificationJob from '../jobs/notificationJob.js';
import Event from '../models/Event.js';

notificationJob(agenda);

const scheduleNotifications = async () => {
    try {
      const events = await Event.find({
        'extendedProps.notifications.isSent': false, 
      });
  
      for (const event of events) {
        for (const notification of event.extendedProps.notifications) {
          const timeDiff = new Date(notification.time) - new Date();
  
          if (timeDiff > 0) {
            await agenda.schedule(notification.time, 'send-notification', {
              event,
              method: notification.methods[0], 
            });
  
            console.log(`Scheduled notification for event: ${event.title}`);
          }
        }
      }
    } catch (err) {
      console.error('Error scheduling notifications:', err);
    }
  };
  
  export default scheduleNotifications;