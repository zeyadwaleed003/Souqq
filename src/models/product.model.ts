import mongoose, { Schema, model } from 'mongoose';
import { IProduct } from '../interfaces/product.interface';

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
  },
  description: String,
  sku: {
    type: String,
    required: [true, 'A product must have a sku'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price'],
  },
  stock: {
    type: Number,
    required: [true, 'A product must have a stock'],
  },
  brand: String,
  is_active: {
    type: Boolean,
    default: true,
  },
  // images - List of image URLs for the product
  // Categories - List of categories the product belongs to
  // created_at
  // updated_at
});

const Product = model<IProduct>('Product', productSchema);

export default Product;
