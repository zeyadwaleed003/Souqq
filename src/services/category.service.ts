import stringify from 'fast-json-stable-stringify';
import { Category } from '../models/category.model';
import { TQueryString, TResponse } from '../types/api.types';
import {
  CreateCategoryBody,
  UpdateCategoryBody,
} from '../types/category.types';
import APIFeatures from '../utils/APIFeatures';
import ResponseFormatter from '../utils/responseFormatter';
import ProductService from './product.service';
import RedisService from './redis.service';
import CloudinaryService from './cloudinary.service';

class CategoryService {
  readonly CACHE_PATTERN = 'categories:*';

  private async getAllSubcategoryIds(
    categoryId: string
  ): Promise<{ ids: string[]; coverImagePublicIds: (string | undefined)[] }> {
    const subCategories = await Category.find({ parent: categoryId }).lean();

    let ids = subCategories.map((cat) => cat._id.toString());
    let coverImagePublicIds = subCategories.map(
      (cat) => cat.coverImagePublicId
    );

    for (const sub of subCategories) {
      const neededIds = await this.getAllSubcategoryIds(sub._id.toString());

      ids = ids.concat(neededIds.ids);
      coverImagePublicIds = coverImagePublicIds.concat(
        neededIds.coverImagePublicIds
      );
    }

    return { ids, coverImagePublicIds };
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

    await RedisService.deleteKeys(this.CACHE_PATTERN);

    return {
      status: 'success',
      statusCode: 201,
      data: {
        category,
      },
    };
  }

  async updateCategory(
    id: string,
    data: UpdateCategoryBody
  ): Promise<TResponse> {
    const category = await Category.findById(id);
    if (!category) ResponseFormatter.notFound('No category found with that id');

    if (data.coverImage)
      CloudinaryService.deleteFromCloud(category.coverImagePublicId);

    category.set(data);
    const newCategory = await category.save();

    await RedisService.deleteKeys(this.CACHE_PATTERN);

    return {
      status: 'success',
      statusCode: 200,
      data: {
        category: newCategory,
      },
    };
  }

  async getCategoryById(id: string): Promise<TResponse> {
    const cacheKey = `categories:${id}`;
    const cachedData = await RedisService.getJSON<TResponse>(cacheKey);

    if (cachedData) return cachedData;

    const category = await Category.findById(id).lean();

    if (!category) ResponseFormatter.notFound('No category found with that id');

    const result = {
      status: 'success',
      statusCode: 200,
      data: {
        category,
      },
    };

    await RedisService.setJSON(cacheKey, 1800, result);

    return result;
  }

  async getAllCategories(
    queryString: TQueryString,
    filter = {}
  ): Promise<TResponse> {
    const cacheKey = `categories:${stringify(queryString)}:${stringify(filter)}`;
    const cachedData = await RedisService.getJSON<TResponse>(cacheKey);

    if (cachedData) return cachedData;

    const features = new APIFeatures(Category.find(filter), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const categories = await features.query.lean();

    const result = {
      status: 'success',
      statusCode: 200,
      size: categories.length,
      data: {
        categories,
      },
    };

    await RedisService.setJSON(cacheKey, 3600, result);

    return result;
  }

  async checkIfCategories(categoryIds: string[]): Promise<boolean> {
    const exists = await Category.exists({ _id: { $in: categoryIds } });
    return Boolean(exists);
  }

  async deleteCategory(id: string): Promise<TResponse> {
    const category = await Category.findById(id)
      .lean()
      .select('coverImagePublicId');
    const subCategoriesIds = await this.getAllSubcategoryIds(id);

    const allCategoryIds = [id, ...subCategoriesIds.ids];
    await Category.deleteMany({ _id: { $in: allCategoryIds } });

    const allCategoriesPublicIds = [
      category!.coverImagePublicId,
      ...subCategoriesIds.coverImagePublicIds,
    ];
    CloudinaryService.deleteMultipleImages(allCategoriesPublicIds);

    await ProductService.removeDeletedCategoriesFromProduct(allCategoryIds);
    await ProductService.deleteProductsWithNoCategories();

    await RedisService.deleteKeys(this.CACHE_PATTERN);

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
