import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import catchAsync from '../utils/catchAsync';
import AuthService from '../services/auth.service';
import env from '../config/env';

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await AuthService.create(req.body);

    const token = jwt.sign(
      { id: newUser.id },
      env.JWT_SECRET as string,
      {
        expiresIn: `${env.JWT_EXPIRES_IN}d`,
      } as object
    );

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  }
);
