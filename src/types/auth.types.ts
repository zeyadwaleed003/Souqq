import { z } from 'zod';
import {
  forgotPasswordSchema,
  loginSchema,
  refreshAccessTokenSchema,
  resetPasswordSchema,
  signupSchema,
  updatePasswordSchema,
  verifyEmailSchema,
} from '../validation/auth.validation';
import { UserPhoto } from './user.types';

export type ResetPasswordBody = z.output<typeof resetPasswordSchema>['body'];
export type ResetPasswordParams = z.output<
  typeof resetPasswordSchema
>['params'];

export type ForgotPasswordBody = z.output<typeof forgotPasswordSchema>['body'];
export type LoginBody = z.output<typeof loginSchema>['body'];
export type VerifyEmailParams = z.output<typeof verifyEmailSchema>['params'];
export type SignupBody = z.output<typeof signupSchema>['body'] & UserPhoto;
export type RefreshAccessTokenBody = z.output<
  typeof refreshAccessTokenSchema
>['body'];
export type updatePasswordBody = z.output<typeof updatePasswordSchema>['body'];
