import Agenda from 'agenda';
import dotenv from 'dotenv';

dotenv.config();

const agenda = new Agenda({
  db: { address: process.env.MONGO_URI, collection: 'jobs' }, 
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