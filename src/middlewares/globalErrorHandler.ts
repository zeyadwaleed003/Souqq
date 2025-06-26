import { Request, Response, NextFunction } from 'express';
import APIError from '../utils/APIError';
import env from '../config/env';
import logger from '../config/logger';

interface BaseError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

interface CastError extends BaseError {
  name: 'CastError';
  path: string;
  value: any;
}

interface DuplicateError extends BaseError {
  code: 11000;
  errorResponse: {
    errmsg: string;
  };
}

interface ValidationError extends BaseError {
  name: 'ValidationError';
  errors: Record<string, { message: string }>;
}

interface JWTError extends BaseError {
  name: 'JsonWebTokenError';
}

interface TokenExpiredError extends BaseError {
  name: 'TokenExpiredError';
}

type DatabaseError = CastError | DuplicateError | ValidationError;
type AuthError = JWTError | TokenExpiredError;
type AppError = BaseError | DatabaseError | AuthError;

const isCastError = (err: AppError): err is CastError =>
  err.name === 'CastError';

const isDuplicateError = (err: AppError): err is DuplicateError =>
  'code' in err && err.code === 11000;

const isValidationError = (err: AppError): err is ValidationError =>
  err.name === 'ValidationError';

const isJWTError = (err: AppError): err is JWTError =>
  err.name === 'JsonWebTokenError';

const isTokenExpiredError = (err: AppError): err is TokenExpiredError =>
  err.name === 'TokenExpiredError';

const handleCastError = (err: CastError) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new APIError(message, 400);
};

const handleDuplicateFieldsError = (err: DuplicateError): APIError => {
  const match = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/);
  const value = match ? match[0] : 'unknow field';
  const message = `Duplicate field value ${value}. Please use another value!`;
  return new APIError(message, 400);
};

const handleValidationError = (err: ValidationError) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new APIError(message, 400);
};

const handleJWTError = () =>
  new APIError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new APIError('Your token is expired. Please log in again!', 401);

const sendErrorDev = (err: AppError, res: Response): void => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err: AppError, res: Response): void => {
  // Operational, trusted error -> send message to the client.
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      message: err.message,
    });
  } else {
    // Programming or unknow error -> don't leak error details.
    logger.error('ERROR: ', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

const processProductionError = (err: AppError): APIError | AppError => {
  if (isCastError(err)) return handleCastError(err);
  if (isDuplicateError(err)) return handleDuplicateFieldsError(err);
  if (isValidationError(err)) return handleValidationError(err);
  if (isJWTError(err)) return handleJWTError();
  if (isTokenExpiredError(err)) return handleJWTExpiredError();

  return err;
};

export default (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (env.NODE_ENV === 'development') sendErrorDev(err, res);
  else if (env.NODE_ENV === 'production') {
    const processedError = processProductionError(err);
    sendErrorProd(processedError, res);
  }
};
