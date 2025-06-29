import { model, Schema } from 'mongoose';

import { cartItemSchema } from './cart.model';
import { OrderDocument, OrderModel } from '../types/order.types';
import VariantService from '../services/variant.service';

const orderSchema = new Schema<OrderDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
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
      country: {
        type: String,
        required: [true, 'A shipping address must have a county'],
      },
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

orderSchema.post('save', async function () {
  for (const item of this.items) {
    await VariantService.decreaseVariantStock(item.variant, item.quantity);
  }
});

export const Order = model<OrderDocument, OrderModel>('Order', orderSchema);
