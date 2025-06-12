import { Router } from 'express';

import isAuthenticated from '../middlewares/isAuthenticated';
import isAuthorized from '../middlewares/isAuthorized';
import {
  addItemToCart,
  getAllCarts,
  getCartById,
  getCurrentUserCart,
  removeItemFromCart,
  setVariantUserIds,
  clearCart,
  updateItemQuantity,
} from '../controllers/cart.controller';
import validate from '../middlewares/validate';
import { idSchema } from '../validation/base.validation';
import {
  removeItemFromCartSchema,
  updateItemCartSchema,
} from '../validation/cart.validation';

const router = Router({ mergeParams: true });

router.use(isAuthenticated);

router.patch('/clear', clearCart);

router.patch(
  '/items/quantity',
  validate(updateItemCartSchema),
  updateItemQuantity
);

router
  .route('/items')
  .all(setVariantUserIds)
  .patch(validate(updateItemCartSchema), addItemToCart)
  .delete(validate(removeItemFromCartSchema), removeItemFromCart);

router.get('/me', getCurrentUserCart);

router.use(isAuthorized('admin'));

router.get('/', getAllCarts);
router.get('/:id', validate(idSchema), getCartById);

export const cartRouter = router;
