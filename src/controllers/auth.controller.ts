import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import catchAsync from '../utils/catchAsync';
import AuthService from '../services/auth.service';
import env from '../config/env';
import APIError from '../utils/APIError';

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

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new APIError('Please provide email and password', 400));

    const user = await AuthService.findOne({ email });

    const isUser = await bcrypt.compare(password, user.password as string);
    if (!isUser) return next(new APIError('Invalid email or password', 404));

    const token = jwt.sign(
      { id: user.id },
      env.JWT_SECRET as string,
      {
        expiresIn: `${env.JWT_EXPIRES_IN}d`,
      } as object
    );

    res.status(201).json({
      status: 'success',
      token,
    });
  }
);
