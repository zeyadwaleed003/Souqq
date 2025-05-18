import { z } from 'zod';
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  resetPasswordSchema,
  signupSchema,
  verifyEmailSchema,
} from '../validation/auth.validation';

export type ResetPasswordBody = z.output<typeof resetPasswordSchema>['body'];
export type ResetPasswordParams = z.output<
  typeof resetPasswordSchema
>['params'];

export type ForgotPasswordBody = z.output<typeof forgotPasswordSchema>['body'];
export type LoginBody = z.output<typeof loginSchema>['body'];
export type VerifyEmailParams = z.output<typeof verifyEmailSchema>['params'];
export type SignupBody = z.output<typeof signupSchema>['body'];
export type RefreshTokenBody = z.output<typeof refreshTokenSchema>['body'];
