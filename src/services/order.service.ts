import { Types } from 'mongoose';

import { TResponse } from '../types/api.types';
import StripeService from './stripe.service';
import { Address, UserDocument } from '../types/user.types';
import CartService from './cart.service';
import RedisService from './redis.service';
import ResponseFormatter from '../utils/responseFormatter';
import { Order } from '../models/order.model';

class OrderService {
  async createCheckoutSession(user: UserDocument): Promise<TResponse> {
    const cacheKey = `shipping-address:${user._id}`;
    const shippingAddress = await RedisService.getJSON(cacheKey);

    if (!shippingAddress)
      ResponseFormatter.badRequest(
        'Shipping address is required or has expired. Please provide shipping address before checkout.'
      );

    const session = await StripeService.checkoutSession(user);

    return {
      statusCode: 200,
      status: 'success',
      data: { session },
    };
  }

  async verifyOrder(userId: string): Promise<TResponse> {
    // NOT A SECURE WAY TO CREATE A NEW ORDER
    // Doing it anyway because can't use the stripe webhooks (Can't find a free website to deploy the project)

    const cacheKey = `shipping-address:${userId}`;
    const shippingAddress = (await RedisService.getJSON<Address>(
      cacheKey
    )) as Address;

    const cart = await CartService.getCartByUserId(userId);

    const data = {
      user: userId,
      items: cart.items,
      shippingAddress,
      totalPrice: cart.totalPrice,
      status: 'paid',
      paidAt: new Date(),
    };

    const order = await Order.create(data);

    CartService.clearCart(userId);

    return {
      status: 'success',
      statusCode: 200,
      message: 'Checkout completed successfully. Your order has been placed.',
      data: {
        order,
      },
    };
  }
}

export default new OrderService();
