import { Review } from '../models/review.model';
import { TQueryString, TResponse } from '../types/api.types';
import { CreateReviewBody, UpdateReviewBody } from '../types/review.types';
import { UserDocument } from '../types/user.types';
import APIError from '../utils/APIError';
import BaseService from './base.service';

class ReviewService {
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
    const review = await Review.findById(id);

    if (!review) throw new APIError('No document found with that id', 404);

    if (user.role === 'user' && !user._id.equals(review.user._id))
      throw new APIError('You are not allowed to delete this review', 403);

    await Review.deleteOne({ _id: id });

    Review.calcRatingStatistics(review.product);

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
    if (review && user.role === 'user' && !user._id.equals(review.user._id))
      throw new APIError('You are not allowed to update this review', 403);

    const result = await BaseService.updateOne(Review, id, data);
    return result;
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
}

export default new ReviewService();
