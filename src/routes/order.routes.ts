import { Router } from 'express';

import isAuthenticated from '../middlewares/isAuthenticated';
import {
  createCheckoutSession,
  verifyOrder,
} from '../controllers/order.controller';

const router = Router();

router.post('/checkout-session', isAuthenticated, createCheckoutSession);
router.get('/success', verifyOrder);

/*
  TODO: 
    - Add Stripe Webhook - Make a new order if successfull - Empty the cart if new order
*/

export const orderRouter = router;
