import { NextFunction, Response } from 'express';
import { TRequest } from '../types/types';
import APIError from '../utils/APIError';

export default (...roles: string[]) =>
  (req: TRequest, res: Response, next: NextFunction) => {
    if (req.user && !roles.includes(req.user.role as string)) {
      throw new APIError(
        'You do not have permission to perform this action',
        403
      );
    }
    next();
  };
