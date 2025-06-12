import { Router } from 'express';

import isAuthenticated from '../middlewares/isAuthenticated';
import isAuthorized from '../middlewares/isAuthorized';
import {
  getAllCarts,
  getCartById,
  getCurrentUserCart,
} from '../controllers/cart.controller';
import validate from '../middlewares/validate';
import { idSchema } from '../validation/base.validation';

const router = Router();

router.get('/me', isAuthenticated, getCurrentUserCart);

router.get('/', isAuthenticated, isAuthorized('admin'), getAllCarts);

router.get(
  '/:id',
  isAuthenticated,
  isAuthorized('admin'),
  validate(idSchema),
  getCartById
);
export const cartRouter = router;
