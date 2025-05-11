import { NextFunction, Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import AuthService from '../services/auth.service';
import APIError from '../utils/APIError';
import { generateToken } from '../utils/token';
import { ILogin, ISignupBody } from '../interfaces/auth.interface';

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await AuthService.signup(req.body as ISignupBody);

    const token = generateToken(newUser.id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthService.login(req.body as ILogin);

    const token = generateToken(user.id);

    res.status(201).json({
      status: 'success',
      token,
    });
  }
);
