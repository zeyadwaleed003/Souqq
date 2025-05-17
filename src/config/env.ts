import dotenv from 'dotenv';
dotenv.config();
import env from 'env-var';

export default {
  PORT: env.get('PORT').required().asPortNumber(),
  NODE_ENV: env.get('NODE_ENV').required().asString(),

  DEV_URL: env.get('DEV_URL').required().asString(),
  PROD_URL: env.get('PROD_URL').asString(),
  BASE_URL:
    process.env.NODE_ENV === 'development'
      ? process.env.DEV_URL
      : process.env.PROD_URL,

  DATABASE_URL: env.get('DATABASE_URL').required().asString(),
  DATABASE_PASSWORD: env.get('DATABASE_PASSWORD').required().asString(),

  LOG_LEVEL: env.get('LOG_LEVEL').asString(),

  JWT_SECRET: env.get('JWT_SECRET').required().asString(),
  JWT_EXPIRES_IN: env.get('JWT_EXPIRES_IN').required().asString(),

  MAILTRAP_HOST: env.get('MAILTRAP_HOST').required().asString(),
  MAILTRAP_PORT: env.get('MAILTRAP_PORT').required().asString(),
  MAILTRAP_USERNAME: env.get('MAILTRAP_USERNAME').required().asString(),
  MAILTRAP_PASSWORD: env.get('MAILTRAP_PASSWORD').required().asString(),

  EMAIL_FROM: env.get('EMAIL_FROM').required().asString(),
};
