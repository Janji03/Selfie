import Agenda from 'agenda';
import dotenv from 'dotenv';
import config from './config.js';

dotenv.config();

const agenda = new Agenda({
  db: { address: config.dbURI, collection: 'jobs' }, 
  processEvery: '1 minute', 
  useUnifiedTopology: true,
});

const gracefulShutdown = async () => {
  await agenda.stop();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default agenda;