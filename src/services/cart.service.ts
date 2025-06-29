import { Types } from 'mongoose';
import { Cart } from '../models/cart.model';
import { TQueryString, TResponse } from '../types/api.types';
import {
  CartDocument,
  RemoveItemFromCartBody,
  UpdateItemCartBody,
} from '../types/cart.types';
import VariantService from './variant.service';
import APIFeatures from '../utils/APIFeatures';
import ResponseFormatter from '../utils/responseFormatter';

class CartService {
  private checkQuantityAvailable(quantity: number, stock: number) {
    if (quantity > stock)
      ResponseFormatter.badRequest(
        'Requested quantity exceeds available stock for this variant'
      );
  }

  async createCart(userId: Types.ObjectId) {
    await Cart.create({ user: userId });
  }

  async getAllCarts(
    queryString: TQueryString,
    filter = {}
  ): Promise<TResponse> {
    const features = new APIFeatures(Cart.find(filter), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const carts = await features.query.lean();

    return {
      status: 'success',
      statusCode: 200,
      size: carts.length,
      data: {
        carts,
      },
    };
  }

  async getCartById(id: string): Promise<TResponse> {
    const cart = await Cart.findById(id).lean();

    if (!cart) ResponseFormatter.notFound('No cart found with that id');

    return {
      status: 'success',
      statusCode: 200,
      data: {
        cart,
      },
    };
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

  async addItemToCart(data: UpdateItemCartBody): Promise<TResponse> {
    const cart = await Cart.findOne({ user: data.user });
    if (!cart) ResponseFormatter.notFound('Failed to load cart');

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

  async removeItemFromCart(data: RemoveItemFromCartBody): Promise<TResponse> {
    const cart = await Cart.findOne({ user: data.user });
    if (!cart) ResponseFormatter.notFound('Failed to load cart');

    const idx = cart.items.findIndex(
      (item) => item.variant.toString() === data.variant
    );
    if (idx === -1) ResponseFormatter.notFound('Item not found in cart');

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

  async clearCart(userId: Types.ObjectId | string): Promise<TResponse> {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) ResponseFormatter.notFound('Failed to load cart');

    cart.items = [];
    await cart.save();

    return {
      statusCode: 200,
      status: 'success',
      data: {
        cart,
      },
    };
  }

  async updateItemQuantity(data: UpdateItemCartBody): Promise<TResponse> {
    const cart = await Cart.findOne({ user: data.user });
    if (!cart) ResponseFormatter.notFound('Failed to load cart');

    const idx = cart.items.findIndex(
      (item) => item.variant.toString() === data.variant
    );
    if (idx === -1) ResponseFormatter.notFound('Item not found in cart');

    const variantDetails = await VariantService.getVariantDetails(data.variant);
    this.checkQuantityAvailable(data.quantity, variantDetails.stock);

    cart.items[idx].quantity = data.quantity;
    await cart.save();

    return {
      statusCode: 200,
      status: 'success',
      data: {
        cart,
      },
    };
  }

  async getCartByUserId(userId: string): Promise<CartDocument> {
    const cart = await Cart.findOne({ user: userId }).lean();
    return cart as CartDocument;
  }
}

export default new CartService();
