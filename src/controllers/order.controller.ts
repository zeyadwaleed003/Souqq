import { RequestHandler } from 'express';

import OrderService from '../services/order.service';
import sendResponse from '../utils/sendResponse';
import APIError from '../utils/APIError';
import { TResponse } from '../types/api.types';

export const createCheckoutSession: RequestHandler = async (req, res, next) => {
  if (!req.user) throw new APIError('Authentication failed', 401);

  const result = await OrderService.createCheckoutSession(req.user);
  sendResponse(result, res);
};

export const verifyOrder: RequestHandler<{}, {}, {}, { q: string }> = async (
  req,
  res,
  next
) => {
  let result: TResponse;
  if (req.query.q === 'true')
    result = {
      statusCode: 200,
      status: 'success',
      message: 'Checkout completed successfully. Your order has been placed.',
    };
  else
    result = {
      statusCode: 400,
      status: 'fail',
      message: 'Checkout failed. Your order could not be processed.',
    };
  sendResponse(result, res);
};
