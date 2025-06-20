import { Document, Model, Types } from 'mongoose';

import { CartItem } from './cart.types';

export type OrderDocument = Document & {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: CartItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'cod' | 'card' | 'apple_pay' | 'google_pay';
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paidAt?: Date;
  deliveredAt?: Date;
};

export type OrderModel = Model<OrderDocument>;
