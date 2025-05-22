import { NextFunction, Request, Response } from 'express';
import APIError from '../utils/APIError';

export default (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user && !roles.includes(req.user.role as string)) {
      throw new APIError(
        'You do not have permission to perform this action',
        403
      );
    }
    next();
  };
