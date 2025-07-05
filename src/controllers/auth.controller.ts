import { RequestHandler } from 'express';

import AuthService from '../services/auth.service';
import {
  SignupBody,
  RefreshAccessTokenBody,
  VerifyEmailParams,
  LoginBody,
  ForgotPasswordBody,
  ResetPasswordBody,
  ResetPasswordParams,
  updatePasswordBody,
} from '../types/auth.types';
import sendResponse from '../utils/sendResponse';

export const signup: RequestHandler<{}, {}, SignupBody> = async (
  req,
  res,
  next
) => {
  if (req.file) {
    req.body.photo = req.file.secure_url;
    req.body.photoPublicId = req.file.public_id;
  }

  const result = await AuthService.signup(req.body);
  sendResponse(result, res);
};

export const verifyEmail: RequestHandler<VerifyEmailParams> = async (
  req,
  res,
  next
) => {
  const result = await AuthService.verifyEmail(req.params);
  sendResponse(result, res);
};

export const login: RequestHandler<{}, {}, LoginBody> = async (
  req,
  res,
  next
) => {
  const result = await AuthService.login(req.body);
  sendResponse(result, res);
};

export const refreshToken: RequestHandler<
  {},
  {},
  RefreshAccessTokenBody
> = async (req, res, next) => {
  const result = await AuthService.refreshToken(req.body);
  sendResponse(result, res);
};

export const forgotPassword: RequestHandler<
  {},
  {},
  ForgotPasswordBody
> = async (req, res, next) => {
  const result = await AuthService.forgotPassword(req.body);
  sendResponse(result, res);
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
  sendResponse(result, res);
};

export const callbackHandler: RequestHandler<{}> = async (req, res, next) => {
  const result = await AuthService.handleCallback(req.user!);
  sendResponse(result, res);
};

export const updatePassword: RequestHandler<
  {},
  {},
  updatePasswordBody
> = async (req, res, next) => {
  const data = {
    user: req.user!,
    body: req.body,
  };

  const result = await AuthService.updatePassword(data);
  sendResponse(result, res);
};
