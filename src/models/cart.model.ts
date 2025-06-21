import { Query, Schema, model } from 'mongoose';
import { CartDocument, CartItem, CartModel } from '../types/cart.types';

export const cartItemSchema = new Schema<CartItem>(
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

cartSchema.pre('save', function (next) {
  let quantitySum = 0,
    priceSum = 0;

  this.items.forEach((item) => {
    quantitySum += item.quantity;
    priceSum += item.price * item.quantity;
  });

  this.set({ totalPrice: priceSum, totalQuantity: quantitySum });
  next();
});

cartSchema.pre(
  /^find/,
  function (this: Query<CartDocument[], CartDocument>, next) {
    this.populate({
      path: 'items.product',
      select: 'name description',
    });

    next();
  }
);

export const Cart = model<CartDocument, CartModel>('Cart', cartSchema);
