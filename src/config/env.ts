import dotenv from 'dotenv';
dotenv.config();
import env from 'env-var';

export default {
  PORT: env.get('PORT').required().asPortNumber(),
  NODE_ENV: env.get('NODE_ENV').required().asString(),
  DATABASE_URL: env.get('DATABASE_URL').required().asString(),
  DATABASE_PASSWORD: env.get('DATABASE_PASSWORD').required().asString(),
  LOG_LEVEL: env.get('LOG_LEVEL').asString(),
  JWT_SECRET: env.get('JWT_SECRET').asString(),
  JWT_EXPIRES_IN: env.get('JWT_EXPIRES_IN').asString(),
};
