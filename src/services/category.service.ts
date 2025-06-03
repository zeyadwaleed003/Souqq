import { Category } from '../models/category.model';
import { TResponse } from '../types/api.types';
import { CreateCategoryBody } from '../types/category.types';
import APIError from '../utils/APIError';
import BaseService from './base.service';

class CategoryService {
  async createCategory(data: CreateCategoryBody): Promise<TResponse> {
    const exists = await Category.exists({ name: data.name });
    if (exists) throw new APIError('This category already exists', 409);

    const result = await BaseService.createOne(Category, data);
    return result;
  }
}

export default new CategoryService();
