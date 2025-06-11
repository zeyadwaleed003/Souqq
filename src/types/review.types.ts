import { Document, Model, Types } from 'mongoose';
import { z } from 'zod';
import { createReviewSchema } from '../validation/review.validation';

export type ReviewDocument = Document & {
  _id: Types.ObjectId;
  product: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  isVerifiedPurchase?: boolean;
  helpfulCount?: number;
};

export type ReviewModel = Model<ReviewDocument>;

export type CreateReviewBody = z.output<typeof createReviewSchema>['body'];
export type UpdateReviewBody = z.output<typeof createReviewSchema>['body'];
