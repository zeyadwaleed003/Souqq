import { Category } from '../models/category.model';
import { TQueryString, TResponse } from '../types/api.types';
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

  async getCategoryById(id: string): Promise<TResponse> {
    const result = await BaseService.getOne(Category, id);
    return result;
  }

  async getAllCategoriesAdmin(queryString: TQueryString): Promise<TResponse> {
    const result = await BaseService.getAll(Category, queryString);
    return result;
  }

  async deleteCategory(id: string): Promise<TResponse> {
    const result = await BaseService.deleteOne(Category, id);
    return result;
  }
}

/*
  TODO:
    - Get All Categories Public
    - Get One Category By Slug
    - Get all the child categories of a category
*/

export default new CategoryService();
