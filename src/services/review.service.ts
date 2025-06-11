import { Review } from '../models/review.model';
import { TQueryString, TResponse } from '../types/api.types';
import { CreateReviewBody } from '../types/review.types';
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
}

export default new ReviewService();
