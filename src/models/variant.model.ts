import { model, Schema } from 'mongoose';

import { VariantDocument, VariantModel } from '../types/variant.types';
import APIError from '../utils/APIError';

const variantSchema = new Schema<VariantDocument>(
  {
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
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'A variant must belong to a product'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

variantSchema.pre('save', function (this) {
  if (!this.color && !this.size)
    throw new APIError('A variant must have a variant theme', 400);

  if (this.oldPrice && this.oldPrice <= this.price)
    throw new APIError(
      'The old price must be greater than the current sale price',
      400
    );
});

export const Variant = model<VariantDocument, VariantModel>(
  'Variant',
  variantSchema
);
