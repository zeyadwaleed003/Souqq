import { NextFunction, Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import AuthService from '../services/auth.service';
import {
  ILoginBody,
  ISignupBody,
  IResetPasswordBody,
} from '../interfaces/auth.interface';
import sendReponse from '../utils/sendReponse';

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthService.signup(req.body as ISignupBody);
    sendReponse(result, res);
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthService.login(req.body as ILoginBody);
    sendReponse(result, res);
  }
);

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthService.forgotPassword(req);
    sendReponse(result, res);
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data: IResetPasswordBody = {
      token: req.params.token,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    };
    const result = await AuthService.resetPassword(data);
    sendReponse(result, res);
  }
);
