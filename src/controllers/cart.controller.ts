import { RequestHandler } from 'express';

import CartService from '../services/cart.service';
import sendResponse from '../utils/sendResponse';
import { IdParams } from '../types/api.types';
import APIError from '../utils/APIError';
import { UpdateItemCartBody } from '../types/cart.types';

export const setVariantUserIds: RequestHandler<
  { variantId: string },
  {},
  UpdateItemCartBody
> = async (req, res, next) => {
  if (!req.user) throw new APIError('Authentication failed', 401);
  if (!req.body.variant) req.body.variant = req.params.variantId;

  req.body.user = req.user._id.toString();
  next();
};

export const getAllCarts: RequestHandler = async (req, res, next) => {
  const result = await CartService.getAllCarts(req.query);
  sendResponse(result, res);
};

export const getCartById: RequestHandler<IdParams> = async (req, res, next) => {
  const result = await CartService.getCartById(req.params.id);
  sendResponse(result, res);
};

export const getCurrentUserCart: RequestHandler = async (req, res, next) => {
  if (!req.user) throw new APIError('Authentication failed', 401);

  const result = await CartService.getCurrentUserCart(req.user._id);
  sendResponse(result, res);
};

export const addItemToCart: RequestHandler = async (req, res, next) => {
  const result = await CartService.addItemToCart(req.body);
  sendResponse(result, res);
};

export const removeItemFromCart: RequestHandler = async (req, res, next) => {
  const result = await CartService.removeItemFromCart(req.body);
  sendResponse(result, res);
};

export const clearCart: RequestHandler = async (req, res, next) => {
  if (!req.user) throw new APIError('Authentication failed', 401);

  const result = await CartService.clearCart(req.user._id);
  sendResponse(result, res);
};

export const updateItemQuantity: RequestHandler = async (req, res, next) => {
  const result = await CartService.updateItemQuantity(req.body);
  sendResponse(result, res);
};
