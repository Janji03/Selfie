import Agenda from 'agenda';
import dotenv from 'dotenv';
import config from './config.js';

dotenv.config();

// Agenda Configuration
const agenda = new Agenda({
  db: { address: config.dbURI, collection: 'jobs' }, 
  processEvery: '1 minute', 
  useUnifiedTopology: true,
});

// Graceful Shutdown
const gracefulShutdown = async () => {
  await agenda.stop();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default agenda;
