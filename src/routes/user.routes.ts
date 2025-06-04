import express from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getMe,
  getUser,
  updateUser,
  updateMe,
  deleteMe,
} from '../controllers/user.controller';
import isAuthenticated from '../middlewares/isAuthenticated';
import isAuthorized from '../middlewares/isAuthorized';
import validate from '../middlewares/validate';
import { idSchema } from '../validation/base.validation';
import {
  createUserSchema,
  updateMeSchema,
  updateUserSchema,
} from '../validation/user.validation';

const router = express.Router();

router.use(isAuthenticated);

router
  .route('/me')
  .get(getMe)
  .patch(validate(updateMeSchema), updateMe)
  .delete(deleteMe);

router.use(isAuthorized('admin'));

router.route('/').get(getAllUsers).post(validate(createUserSchema), createUser);

router
  .route('/:id')
  .all(validate(idSchema))
  .get(getUser)
  .patch(validate(updateUserSchema), updateUser)
  .delete(deleteUser);

export const userRouter = router;
