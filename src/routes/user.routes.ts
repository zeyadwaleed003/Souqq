import express from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from '../controllers/user.controller';
import isAuthenticated from '../middlewares/isAuthenticated';
import isAuthorized from '../middlewares/isAuthorized';
import validate from '../middlewares/validate';
import {
  createOneSchema,
  idSchema,
  updateOneSchema,
} from '../validation/base.validation';

const router = express.Router();

router.use(isAuthenticated);
router.use(isAuthorized('admin'));

router.route('/').get(getAllUsers).post(validate(createOneSchema), createUser);

router
  .route('/:id')
  .all(validate(idSchema))
  .get(getUser)
  .patch(validate(updateOneSchema), updateUser)
  .delete(deleteUser);

export const userRouter = router;
