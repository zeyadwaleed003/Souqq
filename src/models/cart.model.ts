import { Schema, model } from 'mongoose';
import { CartDocument, CartItem, CartModel } from './cart.types';

const cartItemSchema = new Schema<CartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'An item must be a product'],
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: 'Variant',
      required: [true, 'An item must be a variant of a product'],
    },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const cartSchema = new Schema<CartDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A cart must belong to a user'],
      unique: true,
    },
    items: [cartItemSchema],
    totalPrice: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Cart = model<CartDocument, CartModel>('Cart', cartSchema);
