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
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      required: [true, 'A product must have images describing it'],
      validate: {
        validator: function (val: string[]) {
          return val.length > 0;
        },
        message: 'A product must have at least one image',
      },
    },
  },
  { timestamps: true }
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
