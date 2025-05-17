import express from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';
import validate from '../middlewares/validate';
import {
  forgotPasswordValidation,
  resetPasswordValidation,
} from '../validation/auth.validation';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post(
  '/forgot-password',
  validate(forgotPasswordValidation),
  forgotPassword
);
router.patch(
  '/reset-password/:token',
  validate(resetPasswordValidation),
  resetPassword
);

export const authRouter = router;
