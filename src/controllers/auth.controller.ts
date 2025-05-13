import { NextFunction, Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import AuthService from '../services/auth.service';
import { generateToken } from '../utils/token';
import { ILoginBody, ISignupBody } from '../interfaces/auth.interface';

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
    const user = await AuthService.login(req.body as ILoginBody);

    const token = generateToken(user.id);

    res.status(201).json({
      status: 'success',
      token,
    });
  }
);

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await AuthService.forgotPassword(email, req);

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  }
);
