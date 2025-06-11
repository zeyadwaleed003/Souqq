import { RequestHandler } from 'express';

import { CreateReviewBody, UpdateReviewBody } from '../types/review.types';
import sendResponse from '../utils/sendResponse';
import ReviewService from '../services/review.service';
import { IdParams } from '../types/api.types';
import APIError from '../utils/APIError';

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

export const getReviewById: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  const result = await ReviewService.getReviewById(req.params.id);
  sendResponse(result, res);
};

export const deleteReview: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  if (!req.user) throw new APIError('Authentication failed', 401);

  const result = await ReviewService.deleteReview(req.params.id, req.user);
  sendResponse(result, res);
};

export const updateReview: RequestHandler<
  IdParams,
  {},
  UpdateReviewBody
> = async (req, res, next) => {
  if (!req.user) throw new APIError('Authentication failed', 401);

  const result = await ReviewService.updateReview(
    req.params.id,
    req.body,
    req.user
  );
  sendResponse(result, res);
};

export const getCurrentUserReviews: RequestHandler = async (req, res, next) => {
  if (!req.user) throw new APIError('Authentication failed', 401);

  const result = await ReviewService.getCurrentUserReviews(
    req.user._id.toString(),
    req.query
  );
  sendResponse(result, res);
};

export const markAsHelpful: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  if (!req.user) throw new APIError('Authentication failed', 401);

  const result = await ReviewService.markAsHelpful(req.params.id, req.user._id);
  sendResponse(result, res);
};

export const unmarkAsHelpful: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  if (!req.user) throw new APIError('Authentication failed', 401);

  const result = await ReviewService.unmarkAsHelpful(
    req.params.id,
    req.user._id
  );
  sendResponse(result, res);
};
