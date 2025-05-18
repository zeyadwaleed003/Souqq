import express from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
} from '../controllers/auth.controller';
import validate from '../middlewares/validate';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signupSchema,
  verifyEmailSchema,
  loginSchema,
} from '../validation/auth.validation';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);

router.post('/refresh-token', refreshToken);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.patch(
  '/reset-password/:token',
  validate(resetPasswordSchema),
  resetPassword
);
router.get('/verify-email/:token', validate(verifyEmailSchema), verifyEmail);

export const authRouter = router;
