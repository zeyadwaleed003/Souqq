import { NextFunction, Request, Response } from 'express';

import logger from '../config/logger';
import APIError from '../utils/APIError';

export default (req: Request, res: Response, next: NextFunction) => {
  logger.error(`Route ${req.originalUrl} Not Found`);
  next(new APIError(`Can't find ${req.originalUrl} on this server`, 404));
};
