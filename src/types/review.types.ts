import { z } from 'zod';
import { Document, Model, Types } from 'mongoose';

import {
  createReviewSchema,
  updateReviewSchema,
} from '../validation/review.validation';

export type ReviewDocument = Document & {
  _id: Types.ObjectId;
  product: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  isVerifiedPurchase?: boolean;
};

export type ReviewModel = Model<ReviewDocument> & {
  calcRatingStatistics: (productId: Types.ObjectId) => Promise<void>;
};

export type CreateReviewBody = z.output<typeof createReviewSchema>['body'];
export type UpdateReviewBody = z.output<typeof updateReviewSchema>['body'];
