import { Types } from 'mongoose';
import { Cart } from '../models/cart.model';
import { TQueryString, TResponse } from '../types/api.types';
import BaseService from './base.service';
import { AddItemToCartBody, CartDocument } from '../types/cart.types';
import VariantService from './variant.service';
import APIError from '../utils/APIError';

class CartService {
  private checkQuantityAvailable(quantity: number, stock: number) {
    if (quantity > stock)
      throw new APIError(
        'Requested quantity exceeds available stock for this variant',
        400
      );
  }

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

  async getCurrentUserCart(userId: Types.ObjectId): Promise<TResponse> {
    const cart = await Cart.findOne({ user: userId }).lean();
    return {
      statusCode: 200,
      status: 'success',
      data: {
        cart,
      },
    };
  }

  async addItemToCart(data: AddItemToCartBody): Promise<TResponse> {
    const cart = await Cart.findOne({ user: data.user });
    if (!cart) throw new APIError('Failed to load cart', 404);

    const variantDetails = await VariantService.getVariantDetails(data.variant);
    this.checkQuantityAvailable(data.quantity, variantDetails.stock);

    const cartItem = {
      product: variantDetails.product._id,
      variant: variantDetails._id,
      quantity: data.quantity,
      price: variantDetails.price,
    };

    const idx = cart.items.findIndex(
      (item) => item.variant.toString() === variantDetails._id.toString()
    );

    if (idx !== -1) {
      cart.items[idx].quantity = cartItem.quantity;
      cart.items[idx].price = cartItem.price;
    } else cart.items.push(cartItem);

    await cart.save();

    return {
      statusCode: 200,
      status: 'success',
      data: {
        cart,
      },
    };
  }

  async removeItemFromCart(data: {
    user: string;
    variant: string;
  }): Promise<TResponse> {
    const cart = await Cart.findOne({ user: data.user });
    if (!cart) throw new APIError('Failed to load cart', 404);

    const idx = cart.items.findIndex(
      (item) => item.variant.toString() === data.variant
    );
    if (idx === -1) throw new APIError('Item not found in cart', 404);

    cart.items.splice(idx, 1);
    await cart.save();

    return {
      statusCode: 200,
      status: 'success',
      data: {
        cart,
      },
    };
  }
}

export default new CartService();
