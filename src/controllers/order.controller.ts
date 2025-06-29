import { RequestHandler } from 'express';

import OrderService from '../services/order.service';
import sendResponse from '../utils/sendResponse';
import APIError from '../utils/APIError';

export const createCheckoutSession: RequestHandler = async (req, res, next) => {
  if (!req.user) throw new APIError('Authentication failed', 401);

  const result = await OrderService.createCheckoutSession(req.user);
  sendResponse(result, res);
};

export const verifyOrder: RequestHandler<
  {},
  {},
  {},
  { q: string; userId: string }
> = async (req, res, next) => {
  if (req.query.q === 'false')
    sendResponse(
      {
        statusCode: 400,
        status: 'fail',
        message: 'Checkout failed. Your order could not be processed.',
      },
      res
    );

  const result = await OrderService.verifyOrder(req.query.userId);
  sendResponse(result, res);
};
