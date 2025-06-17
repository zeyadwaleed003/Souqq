import { Category } from '../models/category.model';
import { TQueryString, TResponse } from '../types/api.types';
import {
  CreateCategoryBody,
  UpdateCategoryBody,
} from '../types/category.types';
import APIFeatures from '../utils/APIFeatures';
import ResponseFormatter from '../utils/responseFormatter';
import ProductService from './product.service';

class CategoryService {
  private async getAllSubcategoryIds(categoryId: string): Promise<string[]> {
    const subCategories = await Category.find({ parent: categoryId }).lean();
    let ids = subCategories.map((cat) => cat._id.toString());
    for (const sub of subCategories)
      ids = ids.concat(await this.getAllSubcategoryIds(sub._id.toString()));

    return ids;
  }

  async doesCategoryExist(id: string) {
    const exist = await Category.exists({ _id: id });
    return Boolean(exist);
  }

  async createCategory(data: CreateCategoryBody): Promise<TResponse> {
    const exists = await Category.exists({ name: data.name });
    if (exists) ResponseFormatter.conflict('This category already exists');

    const category = await Category.create(data);
    if (!category)
      ResponseFormatter.internalError('Failed to create the document');

    return {
      status: 'success',
      statusCode: 201,
      data: {
        data: category,
      },
    };
  }

  async updateCategory(
    id: string,
    data: UpdateCategoryBody
  ): Promise<TResponse> {
    const category = await Category.findById(id);

    if (!category) ResponseFormatter.notFound('No category found with that id');

    category.set({
      status: 'inactive',
    });
    const newCategory = await category.save();

    return {
      status: 'success',
      statusCode: 200,
      data: {
        category: newCategory,
      },
    };
  }

  async getCategoryById(id: string): Promise<TResponse> {
    const category = await Category.findById(id).lean();

    if (!category) ResponseFormatter.notFound('No category found with that id');

    return {
      status: 'success',
      statusCode: 200,
      data: {
        data: category,
      },
    };
  }

  async getAllCategories(
    queryString: TQueryString,
    filter = {}
  ): Promise<TResponse> {
    const features = new APIFeatures(Category.find(filter), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const categories = await features.query.select('-__v').lean();

    return {
      status: 'success',
      statusCode: 200,
      size: categories.length,
      data: {
        categories,
      },
    };
  }

  async checkIfCategories(categoryIds: string[]): Promise<boolean> {
    const exists = await Category.exists({ _id: { $in: categoryIds } });
    return Boolean(exists);
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
    if (!category)
      ResponseFormatter.notFound('No category found with this slug');

    return {
      statusCode: 200,
      status: 'success',
      data: {
        category,
      },
    };
  }

  async getTopLevelCategories(queryString: TQueryString): Promise<TResponse> {
    const result = this.getAllCategories(queryString, { parent: null });
    return result;
  }

  async getSubcategories(
    id: string,
    queryString: TQueryString
  ): Promise<TResponse> {
    const result = this.getAllCategories(queryString, { parent: id });
    return result;
  }

  async getCategoryProducts(
    id: string,
    queryString: TQueryString
  ): Promise<TResponse> {
    const result = ProductService.getAllProducts(queryString, {
      categories: id,
    });
    return result;
  }
}

export default new CategoryService();
