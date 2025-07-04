import { RequestHandler } from 'express';

import {
  CreateVariantBody,
  UpdateVariantBody,
  VariantImages,
} from '../types/variant.types';
import sendResponse from '../utils/sendResponse';
import VariantService from '../services/variant.service';
import APIError from '../utils/APIError';
import ProductService from '../services/product.service';
import { IdParams } from '../types/api.types';

export const restrictSellerVariantPermissions: RequestHandler<
  {},
  {},
  CreateVariantBody | UpdateVariantBody
> = async (req, res, next) => {
  if (req.user!.role === 'seller' && req.body.status)
    throw new APIError('Seller Not allowed to set variant status', 403);
  next();
};

export const checkProductSellerV: RequestHandler<
  {},
  {},
  CreateVariantBody
> = async (req, res, next) => {
  await ProductService.isProductSeller(req.body.product, req.user!);
  next();
};

export const createVariant: RequestHandler<{}, {}, CreateVariantBody> = async (
  req,
  res,
  next
) => {
  if (req.files && Array.isArray(req.files))
    req.body.images = req.files.map((file) => file.originalname);

  const result = await VariantService.createVariant(req.body);
  sendResponse(result, res);
};

export const getAllVariants: RequestHandler<{}> = async (req, res, next) => {
  const result = await VariantService.getAllVariants(req.query);
  sendResponse(result, res);
};

export const deleteVariant: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  const result = await VariantService.deleteVariant(req.params.id);
  sendResponse(result, res);
};

export const getVariantById: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  const result = await VariantService.getVariantById(req.params.id);
  sendResponse(result, res);
};

export const updateVariant: RequestHandler<
  IdParams,
  {},
  UpdateVariantBody
> = async (req, res, next) => {
  if (req.files && Array.isArray(req.files))
    req.body.images = req.files.map((file) => file.originalname);

  const result = await VariantService.updateVariant(req.params.id, req.body);
  sendResponse(result, res);
};

export const deactivateVariant: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  const result = await VariantService.deactivateVariant(req.params.id);
  sendResponse(result, res);
};

export const getActiveVariants: RequestHandler<{}> = async (req, res, next) => {
  const result = await VariantService.getActiveVariants(req.query);
  sendResponse(result, res);
};

export const getCheapestVariantPerProduct: RequestHandler<{}> = async (
  req,
  res,
  next
) => {
  const result = await VariantService.getCheapestVariantPerProduct();
  sendResponse(result, res);
};

export const deleteVariantImages: RequestHandler<
  IdParams,
  {},
  VariantImages
> = async (req, res, next) => {
  const result = await VariantService.deleteVariantImages(
    req.params.id,
    req.body.images
  );
  sendResponse(result, res);
};

export const addImagesToVariant: RequestHandler<
  IdParams,
  {},
  VariantImages
> = async (req, res, next) => {
  if (req.files && Array.isArray(req.files))
    req.body.images = req.files.map((file) => file.originalname);

  const result = await VariantService.addImagesToVariant(
    req.params.id,
    req.body.images
  );
  sendResponse(result, res);
};
