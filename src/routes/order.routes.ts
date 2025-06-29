import { Router } from 'express';

import {
  getOrders,
  verifyOrder,
  getCurrentUserOrders,
  createCheckoutSession,
  getOrderById,
} from '../controllers/order.controller';
import validate from '../middlewares/validate';
import isAuthorized from '../middlewares/isAuthorized';
import { idSchema } from '../validation/base.validation';
import isAuthenticated from '../middlewares/isAuthenticated';

const router = Router();

router.get('/success', verifyOrder);

router.use(isAuthenticated);
router.post('/checkout-session', createCheckoutSession);

router.get('/me', getCurrentUserOrders);

router.use(isAuthorized('admin'));
router.get('/', getOrders);
router.get('/:id', validate(idSchema), getOrderById);

export const orderRouter = router;
