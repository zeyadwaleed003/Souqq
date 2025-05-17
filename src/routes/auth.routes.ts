import express from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

export const authRouter = router;
