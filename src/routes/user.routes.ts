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
  saveShippingAddress,
} from '../controllers/user.controller';
import isAuthenticated from '../middlewares/isAuthenticated';
import isAuthorized from '../middlewares/isAuthorized';
import validate from '../middlewares/validate';
import { idSchema, userIdSchema } from '../validation/base.validation';
import {
  addressSchema,
  createUserSchema,
  updateMeSchema,
  updateUserSchema,
} from '../validation/user.validation';
import { reviewRouter } from './review.routes';
import { uploadUserPhoto } from '../middlewares/upload';

const router = Router();

router.use(isAuthenticated);

router.post('/shipping-address', validate(addressSchema), saveShippingAddress);

router.use('/:userId/reviews', validate(userIdSchema), reviewRouter);

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
