import { RequestHandler } from 'express';
import ProductService from '../services/product.service';
import { CreateProductBody, UpdateProductBody } from '../types/product.types';
import sendResponse from '../utils/sendResponse';
import { IdParams } from '../types/api.types';
import APIError from '../utils/APIError';

export const defineProductSeller: RequestHandler<{}> = (req, res, next) => {
  if (!req.user) throw new APIError('Authentication failed', 401);

  if (req.user.role === 'seller') {
    req.body.sellerId = req.user._id;
  }
  next();
};

export const restrictProductCreationFields: RequestHandler<
  {},
  {},
  CreateProductBody
> = async (req, res, next) => {
  if (!req.user) throw new APIError('Authentication failed', 401);

  ProductService.restrictProductCreationFields(req.user.role, req.body);
  next();
};

export const restrictProductUpdateFields: RequestHandler<
  {},
  {},
  UpdateProductBody
> = (req, res, next) => {
  if (!req.user) throw new APIError('Authentication failed', 401);

  ProductService.restrictProductUpdateFields(req.user.role, req.body);
  next();
};

export const isProductSeller: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  if (!req.user) throw new APIError('Authentication failed', 401);

  await ProductService.isProductSeller(req.params.id, req.user);
  next();
};

export const createProduct: RequestHandler<{}, {}, CreateProductBody> = async (
  req,
  res,
  next
) => {
  const result = await ProductService.createProduct(req.body);
  sendResponse(result, res);
};

export const getAllProducts: RequestHandler<{}> = async (req, res, next) => {
  const result = await ProductService.getAllProducts(req.query);
  sendResponse(result, res);
};

export const getProductById: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  const result = await ProductService.getProductById(req.params.id);
  sendResponse(result, res);
};

export const deleteProduct: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  const result = await ProductService.deleteProduct(req.params.id);
  sendResponse(result, res);
};

export const updateProduct: RequestHandler<
  IdParams,
  {},
  UpdateProductBody
> = async (req, res, next) => {
  const result = await ProductService.updateProduct(req.params.id, req.body);
  sendResponse(result, res);
};
