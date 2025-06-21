import { Types } from 'mongoose';

import { TResponse } from '../types/api.types';
import StripeService from './stripe.service';
import { UserDocument } from '../types/user.types';

class OrderService {
  async createCheckoutSession(user: UserDocument): Promise<TResponse> {
    const session = await StripeService.checkoutSession(user);

    return {
      statusCode: 200,
      status: 'success',
      session,
    };
  }
}

export default new OrderService();
