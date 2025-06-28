import mongoose from 'mongoose';
import app from './app';
import env from './config/env';
import logger from './config/logger';

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! ' + err);
  server.close(() => {
    process.exit(1);
  });
});

const DB = env.DATABASE_URL.replace('<PASSWORD>', env.DATABASE_PASSWORD);
const PORT = env.PORT || 3000;

mongoose.connect(DB).then(() => {
  logger.info('Database connected successfully');
});

const server = app.listen(PORT, () => {
  logger.info(`Server running on port: ${PORT}`);
  logger.info(`Docs available at ${env.BASE_URL}/api-docs`);
});

process.on('unhandledRejection', (reason) => {
  logger.error('UNHANDLED REJECTION! ' + reason);

  server.close(() => {
    process.exit(1);
  });
});
