import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AuthService from '../services/auth.service';

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await AuthService.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  }
);
