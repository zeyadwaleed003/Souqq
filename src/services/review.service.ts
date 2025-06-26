import { Types } from 'mongoose';

import { Review } from '../models/review.model';
import { TQueryString, TResponse } from '../types/api.types';
import {
  CreateReviewBody,
  ReviewDocument,
  UpdateReviewBody,
} from '../types/review.types';
import { UserDocument } from '../types/user.types';
import ResponseFormatter from '../utils/responseFormatter';
import APIFeatures from '../utils/APIFeatures';
import RedisService from './redis.service';
import stringify from 'fast-json-stable-stringify';
import GeminiService from './gemini.service';

class ReviewService {
  readonly CACHE_PATTERN = 'reviews:*';

  private validateHelpfulAction(
    review: ReviewDocument,
    userId: Types.ObjectId,
    marking: boolean
  ) {
    if (marking && review.helpfulBy.includes(userId))
      ResponseFormatter.conflict(
        'You have already marked this review as helpful before'
      );
    else if (!marking && !review.helpfulBy.includes(userId))
      ResponseFormatter.conflict(
        'You have not marked this review as helpful before'
      );

    if (review.user._id.equals(userId))
      ResponseFormatter.forbidden(
        `You can't mark/unmark your own review as helpful`
      );
  }

  async createReview(data: CreateReviewBody): Promise<TResponse> {
    const review = await Review.create(data);
    if (!review)
      ResponseFormatter.internalError('Failed to create the document');

    await RedisService.deleteKeys(this.CACHE_PATTERN);

    return {
      status: 'success',
      statusCode: 201,
      data: {
        review,
      },
    };
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

    const cacheKey = `reviews:${stringify(queryString)}:${stringify(filter)}`;
    const cachedData = await RedisService.getJSON(cacheKey);

    if (cachedData) return cachedData;

    const features = new APIFeatures(Review.find(filter), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const reviews = await features.query.lean();

    const result = {
      status: 'success',
      statusCode: 200,
      size: reviews.length,
      data: {
        reviews,
      },
    };

    await RedisService.setJSON(cacheKey, 3600, result);

    return result;
  }

  async getReviewById(id: string): Promise<TResponse> {
    const review = await Review.findById(id).lean();

    if (!review) ResponseFormatter.notFound('No review found with that id');

    return {
      status: 'success',
      statusCode: 200,
      data: {
        review,
      },
    };
  }

  async deleteReview(id: string, user: UserDocument): Promise<TResponse> {
    const review = await Review.findById(id).lean();

    if (!review) ResponseFormatter.notFound('No document found with that id');

    if (user.role === 'user' && !user._id.equals(review.user._id))
      ResponseFormatter.forbidden('You are not allowed to delete this review');

    await Review.deleteOne({ _id: id });

    await Review.calcRatingStatistics(review.product);

    await RedisService.deleteKeys(this.CACHE_PATTERN);

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
      ResponseFormatter.forbidden(
        'You are not allowed to update the user or the product of the review'
      );

    const review = await Review.findById(id);
    if (!review) ResponseFormatter.notFound('No document found with that id');

    if (user.role === 'user' && !user._id.equals(review.user._id))
      ResponseFormatter.forbidden('You are not allowed to update this review');

    review.set(data);
    const newReview = await review.save();

    await RedisService.deleteKeys(this.CACHE_PATTERN);

    return {
      status: 'success',
      statusCode: 200,
      data: {
        review: newReview,
      },
    };
  }

  async getCurrentUserReviews(
    userId: string,
    queryString: TQueryString
  ): Promise<TResponse> {
    const features = new APIFeatures(
      Review.find({
        user: userId,
      }),
      queryString
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const Reviews = await features.query.lean();

    return {
      status: 'success',
      statusCode: 200,
      size: Reviews.length,
      data: {
        Reviews,
      },
    };
  }

  async markAsHelpful(id: string, userId: Types.ObjectId): Promise<TResponse> {
    const review = await Review.findById(id);
    if (!review) ResponseFormatter.notFound('No document found with that id');

    this.validateHelpfulAction(review, userId, true);

    review.helpfulCount = review.helpfulCount + 1;
    review.helpfulBy.push(userId);
    await review.save();

    await RedisService.deleteKeys(this.CACHE_PATTERN);

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
    if (!review) ResponseFormatter.notFound('No document found with that id');

    this.validateHelpfulAction(review, userId, false);

    const index = review.helpfulBy.indexOf(userId);

    review.helpfulBy.splice(index, 1);
    review.helpfulCount = review.helpfulCount - 1;
    await review.save();

    await RedisService.deleteKeys(this.CACHE_PATTERN);

    return {
      status: 'success',
      statusCode: 200,
      data: {
        review,
      },
    };
  }

  async getAiReviewsSummary(productId: string): Promise<TResponse> {
    const cacheKey = `reviews:${productId}:summary`;
    const cachedData = await RedisService.getJSON(cacheKey);

    if (cachedData) return cachedData;

    const reviews = await Review.find({ product: productId }).lean();
    if (!reviews)
      ResponseFormatter.badRequest('This product has no reviews yet');

    const response = await GeminiService.summarizeReviews(reviews);

    const result = {
      status: 'success',
      statusCode: 200,
      data: {
        response,
      },
    };

    await RedisService.setJSON(cacheKey, 3600, result);
    return result;
  }
}

export default new ReviewService();
