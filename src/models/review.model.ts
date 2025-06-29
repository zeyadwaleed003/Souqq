import { Schema, Query, model, Types } from 'mongoose';

import { ReviewDocument, ReviewModel } from '../types/review.types';
import APIError from '../utils/APIError';
import ProductService from '../services/product.service';

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
      `You can't make more than one review for the same product`,
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

reviewSchema.statics.calcRatingStatistics = async function (productId: string) {
  const stats: { _id: Types.ObjectId; num: number; avg: number }[] =
    await this.aggregate([
      {
        $match: { product: productId },
      },
      {
        $group: {
          _id: '$product',
          num: { $sum: 1 },
          avg: { $avg: '$rating' },
        },
      },
    ]);

  let quantity = 0;
  let average = 0;

  if (stats.length) {
    quantity = stats[0].num;
    average = stats[0].avg;
  }

  await ProductService.updateRatingStats(productId, { quantity, average });
};

reviewSchema.post('save', async function () {
  await (this.constructor as ReviewModel).calcRatingStatistics(this.product);
});

export const Review = model<ReviewDocument, ReviewModel>(
  'Review',
  reviewSchema
);
