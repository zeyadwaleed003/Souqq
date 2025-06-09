import { RequestHandler } from 'express';
import ProductService from '../services/product.service';
import { CreateProductBody } from '../types/product.types';
import sendResponse from '../utils/sendResponse';
import { IdParams } from '../types/api.types';

export const defineProductSeller: RequestHandler<{}> = async (
  req,
  res,
  next
) => {
  if (req.user?.role === 'seller') {
    req.body.sellerId = req.user._id;
  }
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
