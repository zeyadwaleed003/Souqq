import { Types } from 'mongoose';
import { Cart } from '../models/cart.model';
import { TQueryString, TResponse } from '../types/api.types';
import BaseService from './base.service';

class CartService {
  async createCart(userId: Types.ObjectId) {
    await Cart.create({ user: userId });
  }

  async getAllCarts(queryString: TQueryString): Promise<TResponse> {
    const result = await BaseService.getAll(Cart, queryString);
    return result;
  }

  async getCartById(id: string): Promise<TResponse> {
    const result = await BaseService.getOne(Cart, id);
    return result;
  }

  async deleteCart(userId: string) {
    await Cart.findOneAndDelete({ user: userId });
  }
}

export default new CartService();
