import Event from '../models/Event.js';

export default (agenda) => {
  agenda.define('send-notification', async (job) => {
    const { eventID, notification } = job.attrs.data;

    try {
      const event = await Event.findById(eventID);
      if (!event) throw new Error('Event not found');

      // Implement notification methods
      for (const method of notification.methods) {
        if (method === 'browser') {
          console.log(`Browser notification: ${event.title}`);
        } else if (method === 'email') {
          console.log(`Email notification: ${event.title}`);
        } else if (method === 'whatsapp') {
          console.log(`WhatsApp notification: ${event.title}`);
        }
      }

      // Mark as sent or reschedule if repeatInterval exists
      if (notification.repeatInterval && notification.repeatCount > 0) {
        const nextTime = new Date(notification.time);
        nextTime.setMinutes(nextTime.getMinutes() + parseInt(notification.repeatInterval));

        notification.time = nextTime;
        notification.repeatCount--;

        await agenda.schedule(nextTime, 'send-notification', {
          eventID,
          notification,
        });
      } else {
        notification.isSent = true;
      }

      await event.save();
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  });
};
