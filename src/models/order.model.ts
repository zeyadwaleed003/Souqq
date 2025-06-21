import { model, Schema } from 'mongoose';
import { OrderDocument, OrderModel } from '../types/order.types';
import { cartItemSchema } from './cart.model';

const orderSchema = new Schema<OrderDocument>(
  {
    user: {
      types: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'An order must belong to a user'],
    },
    items: [cartItemSchema],
    shippingAddress: {
      address: {
        type: String,
        required: [true, 'A shipping address must have a specific address'],
      },
      city: {
        type: String,
        required: [true, 'A shipping address must have a city'],
      },
      postalCode: {
        type: String,
        required: [true, 'A shipping address must have a postal code'],
      },
      county: {
        type: String,
        required: [true, 'A shipping address must have a county'],
      },
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'apple_pay', 'google_pay'],
      required: [true, 'An order must have a payment method'],
    },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paidAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
);

export const Order = model<OrderDocument, OrderModel>('Order', orderSchema);
