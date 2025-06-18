import { model, Query, Schema } from 'mongoose';

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
      default: 'active',
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'A variant must belong to a product'],
    },
  },
  { timestamps: true }
);

variantSchema.index({ status: 1 });
variantSchema.index({ price: 1 });

variantSchema.pre(
  /^find/,
  function (this: Query<VariantDocument[], VariantDocument>, next) {
    this.populate({
      path: 'product',
      select: '-__v',
    });

    next();
  }
);

variantSchema.pre('save', async function (next) {
  if (!this.color && !this.size)
    throw new APIError('A variant must have a variant theme', 400);

  if (this.oldPrice && this.oldPrice <= this.price)
    throw new APIError(
      'The old price must be greater than the current sale price',
      400
    );

  const Model = this.constructor as VariantModel;
  const exists = await Model.exists({
    product: this.product,
    color: this.color,
    size: this.size,
    _id: { $ne: this._id },
  });

  if (exists)
    throw new APIError(
      'A variant with this product, color, and size already exists',
      409
    );

  next();
});

export const Variant = model<VariantDocument, VariantModel>(
  'Variant',
  variantSchema
);
