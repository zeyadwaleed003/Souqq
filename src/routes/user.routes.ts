import express from 'express';
import { signup, login } from '../controllers/auth.controller';
import { getAllUsers } from '../controllers/user.controller';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.route('/').get(getAllUsers);

export const userRouter = router;
