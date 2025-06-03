import { RequestHandler } from 'express';

import sendResponse from '../utils/sendResponse';
import CategoryService from '../services/category.service';
import { CreateCategoryBody } from '../types/category.types';

export const createCategory: RequestHandler<
  {},
  {},
  CreateCategoryBody
> = async (req, res, next) => {
  const result = await CategoryService.createCategory(req.body);
  sendResponse(result, res);
};
