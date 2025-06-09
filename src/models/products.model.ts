import { model, Schema, Types } from 'mongoose';
import {
  ProductDocument,
  ProductModel,
  VariantDocument,
} from '../types/product.types';

const variantSchema = new Schema<VariantDocument>({
  price: {
    type: Number,
    required: [true, 'A variant must have a price'],
  },
  oldPrice: Number,
  stock: {
    type: Number,
    required: [true, 'A variant must have a stock'],
  },
  sku: {
    type: String,
    trim: true,
  },
  size: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'out-of-stock'],
    default: 'draft',
  },
});

const productSchema = new Schema<ProductDocument>({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    unique: true,
    trim: true,
  },
  sellerId: {
    type: Types.ObjectId,
    ref: 'User',
  },
  brand: {
    type: String,
    trim: true,
  },
  categories: {
    type: [Types.ObjectId],
    ref: 'Category',
  },
  description: {
    type: String,
    trim: true,
  },
  //   averageRating: Number,
  //   reviewsNumber: Number,
  variants: {
    type: [variantSchema],
    required: [true, 'A product must have at least one variant'],
    validate: [
      {
        validator: function (arr) {
          const seen = new Set<string>();
          for (const v of arr) {
            const size = v.size || '';
            const color = v.color || '';
            const composite = `${size}_${color}`;

            if (seen.has(composite)) return false;

            seen.add(composite);
          }

          return true;
        },
        message: 'Each variant must have a unique (size, color) combination',
      },
    ],
  },
});

export const Product = model<ProductDocument, ProductModel>(
  'Product',
  productSchema
);
