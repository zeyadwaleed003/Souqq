import { Schema, Query, model } from 'mongoose';

import { ReviewDocument, ReviewModel } from '../types/review.types';
import APIError from '../utils/APIError';

const reviewSchema = new Schema<ReviewDocument>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'A review must reference to a product'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A review must have a user'],
    },
    rating: {
      type: Number,
      required: [true, 'A review must have a rating'],
      min: [1, 'A review rating must be more than or equal to 1'],
      max: [5, 'A review rating must be less than or equal to 5'],
    },
    comment: { type: String, required: [true, 'A review must have a comment'] },
    isVerifiedPurchase: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

reviewSchema.pre('save', async function (next) {
  const Model = this.constructor as ReviewModel;
  const exists = await Model.exists({
    product: this.product,
    user: this.user,
    _id: { $ne: this._id },
  });

  if (exists)
    throw new APIError(
      'A variant with this product, color, and size already exists',
      409
    );

  next();
});

reviewSchema.pre(
  /^find/,
  function (this: Query<ReviewDocument[], ReviewDocument>, next) {
    this.populate({
      path: 'user',
      select: 'name photo',
    });

    next();
  }
);

export const Review = model<ReviewDocument, ReviewModel>(
  'Review',
  reviewSchema
);
