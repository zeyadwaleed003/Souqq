import express from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';
import validate from '../middlewares/validate';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signupSchema,
} from '../validation/auth.validation';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', login);

router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.patch(
  '/reset-password/:token',
  validate(resetPasswordSchema),
  resetPassword
);

export const authRouter = router;
