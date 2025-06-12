import { Types, Document, Model } from 'mongoose';

export type CartItem = {
  product: Types.ObjectId;
  variant: Types.ObjectId;
  quantity: number;
  price: number;
};

export type CartDocument = Document & {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CartModel = Model<CartDocument>;
