import { Category } from '../models/category.model';
import { TResponse } from '../types/api.types';
import {
  CreateCategoryBody,
  UpdateCategoryBody,
} from '../types/category.types';
import APIError from '../utils/APIError';
import BaseService from './base.service';

class CategoryService {
  async createCategory(data: CreateCategoryBody): Promise<TResponse> {
    const exists = await Category.exists({ name: data.name });
    if (exists) throw new APIError('This category already exists', 409);

    const result = await BaseService.createOne(Category, data);
    return result;
  }

  async updateCategory(
    id: string,
    data: UpdateCategoryBody
  ): Promise<TResponse> {
    const result = await BaseService.updateOne(Category, id, data);
    return result;
  }
}

/*
  TODO:
    - Delete Category
    - Get All Categories
    - Get One Category

    - Get all the child categories of a category
*/

export default new CategoryService();
