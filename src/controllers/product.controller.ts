import { Request, RequestHandler } from 'express';
import ProductService from '../services/product.service';
import {
  CreateProductBody,
  ProductImages,
  TSellerId,
} from '../types/product.types';
import sendResponse from '../utils/sendResponse';
import { IdParams } from '../types/api.types';
import APIError from '../utils/APIError';

const assignProductImages = (req: Request<{}, {}, ProductImages>) => {
  if (req.files && Array.isArray(req.files)) {
    const images = [],
      imagesPublicIds = [];
    for (const file of req.files) {
      images.push(file.secure_url);
      imagesPublicIds.push(file.public_id);
    }

    req.body.images = images;
    req.body.imagesPublicIds = imagesPublicIds;
  }
};

export const normalizeCategoriesToArray: RequestHandler<
  {},
  {},
  { categories: string | string[] }
> = (req, res, next) => {
  const categories = req.body.categories;
  if (categories && !Array.isArray(categories))
    req.body.categories = [categories];
  next();
};

export const defineProductSeller: RequestHandler<{}, {}, TSellerId> = (
  req,
  res,
  next
) => {
  if (req.user!.role === 'seller') req.body.sellerId = req.user!._id;
  next();
};

export const restrictSellerProductPermissions: RequestHandler<
  {},
  {},
  TSellerId
> = async (req, res, next) => {
  if (req.user!.role === 'seller' && req.body.sellerId)
    throw new APIError('Seller Not allowed to set product sellerId', 403);
  next();
};

export const checkProductSeller: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  await ProductService.isProductSeller(req.params.id, req.user!);
  next();
};

export const createProduct: RequestHandler<{}, {}, CreateProductBody> = async (
  req,
  res,
  next
) => {
  assignProductImages(req);

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

export const updateProduct: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  assignProductImages(req);

  const result = await ProductService.updateProduct(req.params.id, req.body);
  sendResponse(result, res);
};

export const deleteProductImages: RequestHandler<
  IdParams,
  {},
  ProductImages
> = async (req, res, next) => {
  const result = await ProductService.deleteProductImages(
    req.params.id,
    req.body.images
  );
  sendResponse(result, res);
};

export const addImagesToProduct: RequestHandler<
  IdParams,
  {},
  ProductImages
> = async (req, res, next) => {
  assignProductImages(req);

  const result = await ProductService.addImagesToProduct(
    req.params.id,
    req.body.images,
    req.body.imagesPublicIds
  );
  sendResponse(result, res);
};
