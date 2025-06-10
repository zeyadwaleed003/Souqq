import { model, Query, Schema, Types } from 'mongoose';
import { ProductDocument, ProductModel } from '../types/product.types';

const productSchema = new Schema<ProductDocument>(
  {
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.pre(
  /^find/,
  function (this: Query<ProductDocument[], ProductDocument>, next) {
    this.populate({
      path: 'categories',
      select: 'name',
    });

    next();
  }
);

export const Product = model<ProductDocument, ProductModel>(
  'Product',
  productSchema
);
