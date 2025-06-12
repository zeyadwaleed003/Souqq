import { Types } from 'mongoose';

import { Review } from '../models/review.model';
import { TQueryString, TResponse } from '../types/api.types';
import {
  CreateReviewBody,
  ReviewDocument,
  UpdateReviewBody,
} from '../types/review.types';
import { UserDocument } from '../types/user.types';
import APIError from '../utils/APIError';
import BaseService from './base.service';

class ReviewService {
  private validateHelpfulAction(
    review: ReviewDocument,
    userId: Types.ObjectId,
    marking: boolean
  ) {
    if (marking && review.helpfulBy.includes(userId))
      throw new APIError(
        'You have already marked this review as helpful before',
        400
      );
    else if (!marking && !review.helpfulBy.includes(userId))
      throw new APIError(
        'You have not marked this review as helpful before',
        400
      );

    if (review.user._id.equals(userId))
      throw new APIError(
        `You can't mark/unmark your own review as helpful`,
        403
      );
  }

  async createReview(data: CreateReviewBody): Promise<TResponse> {
    const result = await BaseService.createOne(Review, data);
    return result;
  }

  async getReviews(
    params: {
      productId: string;
      userId: string;
    },
    queryString: TQueryString
  ): Promise<TResponse> {
    let filter = {};
    if (params.productId) filter = { product: params.productId };
    else if (params.userId) filter = { user: params.userId };

    const result = await BaseService.getAll(Review, queryString, filter);
    return result;
  }

  async getReviewById(id: string): Promise<TResponse> {
    const result = await BaseService.getOne(Review, id);
    return result;
  }

  async deleteReview(id: string, user: UserDocument): Promise<TResponse> {
    const review = await Review.findById(id).lean();

    if (!review) throw new APIError('No document found with that id', 404);

    if (user.role === 'user' && !user._id.equals(review.user._id))
      throw new APIError('You are not allowed to delete this review', 403);

    await Review.deleteOne({ _id: id });

    await Review.calcRatingStatistics(review.product);

    return {
      status: 'success',
      statusCode: 204,
      message: 'Document deleted successfully',
    };
  }

  async updateReview(
    id: string,
    data: UpdateReviewBody,
    user: UserDocument
  ): Promise<TResponse> {
    if (user.role === 'user' && (data.product || data.user))
      throw new APIError(
        'You are not allowed to update the user or the product of the review',
        403
      );

    const review = await Review.findById(id);
    if (!review) throw new APIError('No document found with that id', 404);

    if (user.role === 'user' && !user._id.equals(review.user._id))
      throw new APIError('You are not allowed to update this review', 403);

    review.set(data);
    const newDoc = await review.save();

    return {
      status: 'success',
      statusCode: 200,
      data: {
        data: newDoc,
      },
    };
  }

  async getCurrentUserReviews(
    userId: string,
    queryString: TQueryString
  ): Promise<TResponse> {
    const result = await BaseService.getAll(Review, queryString, {
      user: userId,
    });
    return result;
  }

  async markAsHelpful(id: string, userId: Types.ObjectId): Promise<TResponse> {
    const review = await Review.findById(id);
    if (!review) throw new APIError('No document found with that id', 404);

    this.validateHelpfulAction(review, userId, true);

    review.helpfulCount = review.helpfulCount + 1;
    review.helpfulBy.push(userId);
    await review.save();

    return {
      status: 'success',
      statusCode: 200,
      data: {
        review,
      },
    };
  }

  async unmarkAsHelpful(
    id: string,
    userId: Types.ObjectId
  ): Promise<TResponse> {
    const review = await Review.findById(id);
    if (!review) throw new APIError('No document found with that id', 404);

    this.validateHelpfulAction(review, userId, false);

    const index = review.helpfulBy.indexOf(userId);

    review.helpfulBy.splice(index, 1);
    review.helpfulCount = review.helpfulCount - 1;
    await review.save();

    return {
      status: 'success',
      statusCode: 200,
      data: {
        review,
      },
    };
  }
}

export default new ReviewService();
