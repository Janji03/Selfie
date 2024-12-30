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
