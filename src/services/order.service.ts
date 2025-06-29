import CartService from './cart.service';
import RedisService from './redis.service';
import StripeService from './stripe.service';
import { Order } from '../models/order.model';
import APIFeatures from '../utils/APIFeatures';
import ResponseFormatter from '../utils/responseFormatter';
import { Address, UserDocument } from '../types/user.types';
import { TQueryString, TResponse } from '../types/api.types';

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

  async getCurrentUserOrders(
    userId: string,
    queryString: TQueryString
  ): Promise<TResponse> {
    const features = new APIFeatures(
      Order.find({
        user: userId,
      }),
      queryString
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const orders = await features.query.lean();

    return {
      status: 'success',
      statusCode: 200,
      size: orders.length,
      data: {
        orders,
      },
    };
  }

  async getOrders(queryString: TQueryString): Promise<TResponse> {
    const features = new APIFeatures(Order.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const orders = await features.query.lean();

    return {
      status: 'success',
      statusCode: 200,
      size: orders.length,
      data: {
        orders,
      },
    };
  }

  async getOrderById(id: string): Promise<TResponse> {
    const order = await Order.findById(id);
    if (!order) ResponseFormatter.notFound('No document found with that id');

    return {
      status: 'success',
      statusCode: 200,
      data: {
        order,
      },
    };
  }

  async didUserOrderProduct(
    userId: string,
    productId: string
  ): Promise<boolean> {
    return Boolean(
      await Order.exists({ user: userId, 'items.product': productId })
    );
  }
}

export default new OrderService();
