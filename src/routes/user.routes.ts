import express from 'express';
import { getAllUsers } from '../controllers/user.controller';

const router = express.Router();

router.route('/').get(getAllUsers);

export const userRouter = router;
