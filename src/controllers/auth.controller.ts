import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import catchAsync from '../utils/catchAsync';
import AuthService from '../services/auth.service';
import APIError from '../utils/APIError';
import { generateToken } from '../utils/token';
import { ISignupBody } from '../interfaces/auth.interface';

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
    const { email, password } = req.body;

    if (!email || !password)
      return next(new APIError('Please provide email and password', 400));

    const user = await AuthService.findOne({ email });

    const isUser = await bcrypt.compare(password, user.password as string);
    if (!isUser) return next(new APIError('Invalid email or password', 404));

    const token = generateToken(user.id);

    res.status(201).json({
      status: 'success',
      token,
    });
  }
);
