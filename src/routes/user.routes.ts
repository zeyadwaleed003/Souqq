import express from 'express';
import { signup } from '../controllers/auth.controller';
import { getAllUsers } from '../controllers/user.controller';

const router = express.Router();

router.post('/signup', signup);

router.route('/').get(getAllUsers);

export const userRouter = router;
