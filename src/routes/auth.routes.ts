import express from 'express';
import { signup, login, forgotPassword } from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

export const authRouter = router;
