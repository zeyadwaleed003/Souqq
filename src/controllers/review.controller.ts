import { RequestHandler } from 'express';

import { CreateReviewBody } from '../types/review.types';
import sendResponse from '../utils/sendResponse';
import ReviewService from '../services/review.service';

export const setProductUserIds: RequestHandler<
  { productId: string },
  {},
  CreateReviewBody
> = async (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;

  req.body.user = req.user?.id;
  next();
};

export const createReview: RequestHandler<{}, {}, CreateReviewBody> = async (
  req,
  res,
  next
) => {
  const result = await ReviewService.createReview(req.body);
  sendResponse(result, res);
};

export const getReviews: RequestHandler<{
  productId: string;
  userId: string;
}> = async (req, res, next) => {
  const result = await ReviewService.getReviews(req.params, req.query);
  sendResponse(result, res);
};
