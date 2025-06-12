import { Router } from 'express';

import isAuthenticated from '../middlewares/isAuthenticated';
import isAuthorized from '../middlewares/isAuthorized';
import {
  addItemToCart,
  getAllCarts,
  getCartById,
  getCurrentUserCart,
  setVariantUserIds,
} from '../controllers/cart.controller';
import validate from '../middlewares/validate';
import { idSchema } from '../validation/base.validation';
import { addItemToCartSchema } from '../validation/cart.validation';

const router = Router({ mergeParams: true });

router.use(isAuthenticated);

router
  .route('/items')
  .patch(setVariantUserIds, validate(addItemToCartSchema), addItemToCart);

router.get('/me', getCurrentUserCart);

router.use(isAuthorized('admin'));

router.get('/', getAllCarts);
router.get('/:id', validate(idSchema), getCartById);

export const cartRouter = router;
