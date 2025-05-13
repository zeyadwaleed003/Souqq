import { NextFunction, Response } from 'express';

import APIError from '../utils/APIError';
import { verifyToken } from '../utils/token';
import { User } from '../models/user.model';
import { IRequest } from '../types/types';

export default async (req: IRequest, res: Response, next: NextFunction) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  )
    return next(
      new APIError('You are not logged in! please login to get access.', 401)
    );

  const token = req.headers.authorization.split(' ')[1];

  const decoded = verifyToken(token);

  const user = await User.findById(decoded.id);
  if (!user)
    return next(
      new APIError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );

  // Check if the user changed his password after the token has been created
  next();
};
