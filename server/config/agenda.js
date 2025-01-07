import Agenda from 'agenda';
import dotenv from 'dotenv';
import config from './config.js';
import defineNotificationJob from "../jobs/eventNotificationJob.js";
import defineTaskNotificationJob from "../jobs/taskNotificationJob.js";
import defineOverdueTaskJob from "../jobs/overdueTaskJob.js";
import defineInviteNotificationJob from "../jobs/inviteNotificationJob.js"

dotenv.config();

// Agenda Configuration
const agenda = new Agenda({
  db: { address: config.dbURI, collection: 'jobs' }, 
  processEvery: '1 minute', 
  useUnifiedTopology: true,
});

defineNotificationJob(agenda);
defineTaskNotificationJob(agenda);
defineOverdueTaskJob(agenda);
defineInviteNotificationJob(agenda);

// Graceful Shutdown
const gracefulShutdown = async () => {
  try {    
    await agenda.stop();
    process.exit(0);
  } catch (err) {
    console.error("Error during graceful shutdown:", err);
    process.exit(1); 
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default agenda;
