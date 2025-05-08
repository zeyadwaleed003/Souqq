import { Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string;
  sku: string;
  price: number;
  stock: number;
  brand?: string;
  is_active?: boolean;
}
