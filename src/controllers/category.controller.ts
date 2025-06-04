import { RequestHandler } from 'express';

import { IdParams } from '../types/api.types';
import sendResponse from '../utils/sendResponse';
import CategoryService from '../services/category.service';
import {
  CreateCategoryBody,
  UpdateCategoryBody,
} from '../types/category.types';

export const createCategory: RequestHandler<
  {},
  {},
  CreateCategoryBody
> = async (req, res, next) => {
  const result = await CategoryService.createCategory(req.body);
  sendResponse(result, res);
};

export const updateCategory: RequestHandler<
  IdParams,
  {},
  UpdateCategoryBody
> = async (req, res, next) => {
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

export const getAllCategoriesAdmin: RequestHandler<IdParams> = async (
  req,
  res,
  next
) => {
  const result = await CategoryService.getAllCategoriesAdmin(req.query);
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
