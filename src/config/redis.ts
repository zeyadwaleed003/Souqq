import { createClient } from 'redis';

import env from './env';
import logger from './logger';

const client = createClient({
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
  socket: {
    host: env.REDIS_URL,
    port: env.REDIS_PORT,
  },
});

client.on('error', (err) => logger.error('Redis Client Error', err));
client
  .connect()
  .then(() => logger.info('Redis Connected Successfully'))
  .catch((err) => logger.error('Redis Connection Failed', err));

export default client;
