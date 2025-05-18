import { RequestHandler } from 'express';

import AuthService from '../services/auth.service';
import {
  SignupBody,
  RefreshTokenBody,
  VerifyEmailParams,
  LoginBody,
  ForgotPasswordBody,
  ResetPasswordBody,
  ResetPasswordParams,
} from '../types/auth.types';
import sendReponse from '../utils/sendReponse';

export const signup: RequestHandler<{}, {}, SignupBody> = async (
  req,
  res,
  next
) => {
  const result = await AuthService.signup(req.body);
  sendReponse(result, res);
};

export const verifyEmail: RequestHandler<VerifyEmailParams> = async (
  req,
  res,
  next
) => {
  const result = await AuthService.verifyEmail(req.params);
  sendReponse(result, res);
};

export const login: RequestHandler<{}, {}, LoginBody> = async (
  req,
  res,
  next
) => {
  const result = await AuthService.login(req.body);
  sendReponse(result, res);
};

export const refreshToken: RequestHandler<{}, {}, RefreshTokenBody> = async (
  req,
  res,
  next
) => {
  const result = await AuthService.refreshToken(req.body);
  sendReponse(result, res);
};

export const forgotPassword: RequestHandler<
  {},
  {},
  ForgotPasswordBody
> = async (req, res, next) => {
  const result = await AuthService.forgotPassword(req.body);
  sendReponse(result, res);
};

export const resetPassword: RequestHandler<
  ResetPasswordParams,
  {},
  ResetPasswordBody
> = async (req, res, next) => {
  const data: ResetPasswordBody & ResetPasswordParams = {
    token: req.params.token,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };
  const result = await AuthService.resetPassword(data);
  sendReponse(result, res);
};
