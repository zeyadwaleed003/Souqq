import { RequestHandler } from 'express';

import { IdParams } from '../types/api.types';
import sendResponse from '../utils/sendResponse';
import OrderService from '../services/order.service';

export const createCheckoutSession: RequestHandler = async (req, res, next) => {
  const result = await OrderService.createCheckoutSession(req.user!);
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

export const getCurrentUserOrders: RequestHandler = async (req, res, next) => {
  const result = await OrderService.getCurrentUserOrders(
    req.user!.id,
    req.query
  );
  sendResponse(result, res);
};

export const getOrders: RequestHandler = async (req, res, next) => {
  const result = await OrderService.getOrders(req.query);
  sendResponse(result, res);
};

export const getOrderById: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  const result = await OrderService.getOrderById(req.params.id);
  sendResponse(result, res);
};
