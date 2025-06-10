import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { TQueryString, TResponse } from '../types/api.types';
import {
  CreateCategoryBody,
  UpdateCategoryBody,
} from '../types/category.types';
import APIError from '../utils/APIError';
import BaseService from './base.service';
import ProductService from './product.service';

class CategoryService {
  private async getAllSubcategoryIds(categoryId: string): Promise<string[]> {
    const subCategories = await Category.find({ parent: categoryId });
    let ids = subCategories.map((cat) => cat._id.toString());
    for (const sub of subCategories)
      ids = ids.concat(await this.getAllSubcategoryIds(sub._id.toString()));

    return ids;
  }

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

  async getAllCategories(queryString: TQueryString): Promise<TResponse> {
    const result = await BaseService.getAll(Category, queryString);
    return result;
  }

  async deleteCategory(id: string): Promise<TResponse> {
    const subCategoriesIds = await this.getAllSubcategoryIds(id);

    const allCategoryIds = [id, ...subCategoriesIds];
    await Category.deleteMany({ _id: { $in: allCategoryIds } });

    await ProductService.removeDeletedCategoriesFromProduct(allCategoryIds);
    await ProductService.deleteProductsWithNoCategories();

    return {
      status: 'success',
      statusCode: 204,
      message: `The category and it's subcategories have been deleted successfully`,
    };
  }

  async getCategoryBySlug(slug: string): Promise<TResponse> {
    const category = await Category.findOne({ slug: slug });
    if (!category) throw new APIError('No category found with this slug', 404);

    return {
      statusCode: 200,
      status: 'success',
      data: {
        category,
      },
    };
  }

  async getTopLevelCategories(queryString: TQueryString): Promise<TResponse> {
    const result = BaseService.getAll(Category, queryString, { parent: null });
    return result;
  }

  async getSubcategories(
    id: string,
    queryString: TQueryString
  ): Promise<TResponse> {
    const result = BaseService.getAll(Category, queryString, { parent: id });
    return result;
  }

  async getCategoryProducts(
    id: string,
    queryString: TQueryString
  ): Promise<TResponse> {
    const result = BaseService.getAll(Product, queryString, { categories: id });
    return result;
  }
}

export default new CategoryService();
