import { Request, RequestHandler } from 'express';

import { IdParams, SlugParams } from '../types/api.types';
import sendResponse from '../utils/sendResponse';
import CategoryService from '../services/category.service';
import { CoverImage } from '../types/category.types';

const assignCategoryCoverImage = (req: Request<{}, {}, CoverImage>) => {
  if (req.file) {
    req.body.coverImage = req.file.secure_url;
    req.body.coverImagePublicId = req.file.public_id;
  }
};

export const createCategory: RequestHandler = async (req, res, next) => {
  assignCategoryCoverImage(req);

  const result = await CategoryService.createCategory(req.body);
  sendResponse(result, res);
};

export const updateCategory: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  assignCategoryCoverImage(req);

  const result = await CategoryService.updateCategory(req.params.id, req.body);
  sendResponse(result, res);
};

export const getCategoryById: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  const result = await CategoryService.getCategoryById(req.params.id);
  sendResponse(result, res);
};

export const getAllCategories: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  const result = await CategoryService.getAllCategories(req.query);
  sendResponse(result, res);
};

export const deleteCategory: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  const result = await CategoryService.deleteCategory(req.params.id);
  sendResponse(result, res);
};

export const getCategoryBySlug: RequestHandler<SlugParams> = async (
  req,
  res,
  next
) => {
  const result = await CategoryService.getCategoryBySlug(req.params.slug);
  sendResponse(result, res);
};

export const getTopLevelCategories: RequestHandler<{}> = async (
  req,
  res,
  next
) => {
  const result = await CategoryService.getTopLevelCategories(req.query);
  sendResponse(result, res);
};

export const getSubcategories: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  const result = await CategoryService.getSubcategories(
    req.params.id,
    req.query
  );
  sendResponse(result, res);
};

export const getCategoryProducts: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  const result = await CategoryService.getCategoryProducts(
    req.params.id,
    req.query
  );
  sendResponse(result, res);
};
