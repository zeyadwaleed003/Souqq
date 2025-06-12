import { RequestHandler } from 'express';

import CartService from '../services/cart.service';
import sendResponse from '../utils/sendResponse';
import { IdParams } from '../types/api.types';

export const getAllCarts: RequestHandler = async (req, res, next) => {
  const result = await CartService.getAllCarts(req.query);
  sendResponse(result, res);
};

export const getCartById: RequestHandler<IdParams> = async (req, res, next) => {
  const result = await CartService.getCartById(req.params.id);
  sendResponse(result, res);
};
