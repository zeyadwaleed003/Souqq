import env from '../config/env';
import stripe from '../config/stripe';
import { UserDocument } from '../types/user.types';
import ResponseFormatter from '../utils/responseFormatter';
import CartService from './cart.service';

type LineItem = {
  quantity: number;
  price_data: {
    currency: string;
    unit_amount: number;
    product_data?: {
      name: string;
      description: string;
      images?: string[];
    };
  };
};

class StripeService {
  async checkoutSession(user: UserDocument): Promise<object> {
    const userId = user._id.toString();

    const cart = await CartService.getCartByUserId(userId);
    if (cart.items.length === 0) ResponseFormatter.badRequest('Cart is empty');

    const line_items: LineItem[] = cart.items.map((item) => {
      const product: { name: string; description: string; images: string[] } =
        item.product as any;

      return {
        quantity: item.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: item.price * 100,
          product_data: {
            name: product.name,
            description: product.description,
            images: product.images,
          },
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      mode: 'payment',
      success_url: `${env.BASE_URL}api/v1/orders/success?q=true`,
      cancel_url: `${env.BASE_URL}api/v1/orders/success?q=false`,
      client_reference_id: userId,
      line_items,
    });

    return session;
  }
}

export default new StripeService();
