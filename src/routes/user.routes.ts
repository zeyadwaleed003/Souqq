import { Router } from 'express';
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
import { idSchema, userIdSchema } from '../validation/base.validation';
import {
  createUserSchema,
  updateMeSchema,
  updateUserSchema,
} from '../validation/user.validation';
import { reviewRouter } from './review.routes';
import { uploadUserPhoto } from '../middlewares/upload';

const router = Router();

router.use('/:userId/reviews', validate(userIdSchema), reviewRouter);

router.use(isAuthenticated);

router
  .route('/me')
  .get(getMe)
  .patch(uploadUserPhoto, validate(updateMeSchema), updateMe)
  .delete(deleteMe);

router
  .route('/')
  .all(isAuthorized('admin'))
  .get(getAllUsers)
  .post(uploadUserPhoto, validate(createUserSchema), createUser);

router
  .route('/:id')
  .all(validate(idSchema))
  .get(getUser)
  .patch(
    uploadUserPhoto,
    isAuthorized('admin'),
    validate(updateUserSchema),
    updateUser
  )
  .delete(isAuthorized('admin'), deleteUser);

export const userRouter = router;
