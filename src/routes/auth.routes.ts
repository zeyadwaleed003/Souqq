import express, { NextFunction } from 'express';
import passport from 'passport';

import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
  callbackHandler,
} from '../controllers/auth.controller';
import validate from '../middlewares/validate';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signupSchema,
  verifyEmailSchema,
  loginSchema,
  refreshTokenSchema,
} from '../validation/auth.validation';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);

router.post('/refresh-token', validate(refreshTokenSchema), refreshToken);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.patch(
  '/reset-password/:token',
  validate(resetPasswordSchema),
  resetPassword
);
router.get('/verify-email/:token', validate(verifyEmailSchema), verifyEmail);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  callbackHandler
);

export const authRouter = router;
