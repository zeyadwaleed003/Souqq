import { RequestHandler } from 'express';

import { CreateVariantBody } from '../types/variant.types';
import sendResponse from '../utils/sendResponse';
import VariantService from '../services/variant.service';
import APIError from '../utils/APIError';
import ProductService from '../services/product.service';

export const restrictSellerVariantPermissions: RequestHandler<
  {},
  {},
  CreateVariantBody
> = async (req, res, next) => {
  if (!req.user) throw new APIError('Authentication failed', 401);

  if (req.user.role === 'seller' && req.body.status)
    throw new APIError('Seller Not allowed to set variant status', 403);
  next();
};

export const checkProductSellerV: RequestHandler<
  {},
  {},
  CreateVariantBody
> = async (req, res, next) => {
  if (!req.user) throw new APIError('Authentication failed', 401);

  await ProductService.isProductSeller(req.body.product, req.user);
  next();
};

export const createVariant: RequestHandler<{}, {}, CreateVariantBody> = async (
  req,
  res,
  next
) => {
  const result = await VariantService.createVariant(req.body);
  sendResponse(result, res);
};

export const getAllVariants: RequestHandler<{}> = async (req, res, next) => {
  const result = await VariantService.getAllVariants(req.query);
  sendResponse(result, res);
};
