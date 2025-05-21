import dotenv from 'dotenv';
dotenv.config();
import env from 'env-var';

const NODE_ENV = env.get('NODE_ENV').required().asString();

const DEV_URL = env.get('DEV_URL').required().asString();
const PROD_URL = env.get('PROD_URL').asString();

const BASE_URL = NODE_ENV === 'development' ? DEV_URL : PROD_URL;

export default {
  PORT: env.get('PORT').required().asPortNumber(),
  NODE_ENV,

  BASE_URL,

  DATABASE_URL: env.get('DATABASE_URL').required().asString(),
  DATABASE_PASSWORD: env.get('DATABASE_PASSWORD').required().asString(),

  LOG_LEVEL: env.get('LOG_LEVEL').asString(),

  ACCESS_TOKEN_SECRET: env.get('ACCESS_TOKEN_SECRET').required().asString(),
  ACCESS_TOKEN_EXPIRES_IN: env
    .get('ACCESS_TOKEN_EXPIRES_IN')
    .required()
    .asString(),
  REFRESH_TOKEN_SECRET: env.get('REFRESH_TOKEN_SECRET').required().asString(),
  REFRESH_TOKEN_EXPIRES_IN: env
    .get('REFRESH_TOKEN_EXPIRES_IN')
    .required()
    .asString(),

  GOOGLE_CLIENT_ID: env.get('GOOGLE_CLIENT_ID').required().asString(),
  GOOGLE_CLIENT_SECRET: env.get('GOOGLE_CLIENT_SECRET').required().asString(),
  GOOGLE_CALLBACK_URL: env.get('GOOGLE_CALLBACK_URL').required().asString(),

  MAILTRAP_HOST: env.get('MAILTRAP_HOST').required().asString(),
  MAILTRAP_PORT: env.get('MAILTRAP_PORT').required().asString(),
  MAILTRAP_USERNAME: env.get('MAILTRAP_USERNAME').required().asString(),
  MAILTRAP_PASSWORD: env.get('MAILTRAP_PASSWORD').required().asString(),

  EMAIL_FROM: env.get('EMAIL_FROM').required().asString(),
};
