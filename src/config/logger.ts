// Using winston for application-level logging
import winston from 'winston';
import env from './env';

const { combine, colorize, timestamp, printf, json, prettyPrint } =
 winston.format;

const logger = winston.createLogger({
 level: env.LOG_LEVEL || 'info',
 format: combine(timestamp(), json(), prettyPrint()),
 transports: [
  new winston.transports.File({
   level: 'error',
   filename: `${__dirname}/../../logs/error.log`,
  }),
  new winston.transports.File({
   filename: `${__dirname}/../../logs/app.log`,
  }),
 ],
});

if (env.NODE_ENV !== 'production') {
 logger.add(
  new winston.transports.Console({
   format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(({ timestamp, level, message }) => {
     return `${timestamp} [${level}]: ${message}`;
    })
   ),
  })
 );
}

export default logger;
