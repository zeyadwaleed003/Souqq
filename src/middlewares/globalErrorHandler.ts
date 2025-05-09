import { Request, Response, NextFunction, response } from 'express';
import APIError from '../utils/APIError';
import env from '../config/env';
import logger from '../config/logger';

const sendErrorDev = (err: any, res: Response): void => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err: any, res: Response): void => {
  // Operational, trusted error -> send message to the client.
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or unknow error -> don't leak error details.
  logger.error('ERROR: ', err);

  res.status(500).json({
    status: 'error',
    message: 'something went wrong',
  });
};

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (env.NODE_ENV === 'development') sendErrorDev(err, res);
  else if (env.NODE_ENV === 'production') sendErrorProd(err, res);
};
