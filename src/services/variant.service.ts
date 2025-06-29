import stringify from 'fast-json-stable-stringify';

import { Variant } from '../models/variant.model';
import { TQueryString, TResponse } from '../types/api.types';
import {
  CreateVariantBody,
  UpdateVariantBody,
  VariantDocument,
} from '../types/variant.types';
import APIFeatures from '../utils/APIFeatures';
import ResponseFormatter from '../utils/responseFormatter';
import RedisService from './redis.service';
import APIError from '../utils/APIError';

class VariantService {
  readonly CACHE_PATTERN = 'variants:*';

  async getVariantDetails(variantId: string): Promise<VariantDocument> {
    const variant = await Variant.findById(variantId).lean();
    if (!variant)
      ResponseFormatter.badRequest(
        'The provided variant id does not match any existing variant'
      );

    return variant;
  }

  async createVariant(data: CreateVariantBody): Promise<TResponse> {
    const variant = await Variant.create(data);
    if (!variant)
      ResponseFormatter.internalError('Failed to create the document');

    await RedisService.deleteKeys(this.CACHE_PATTERN);

    return {
      status: 'success',
      statusCode: 201,
      data: {
        variant,
      },
    };
  }

  async getAllVariants(
    queryString: TQueryString,
    filter = {}
  ): Promise<TResponse> {
    const cacheKey = `variants:${stringify(queryString)}:${stringify(filter)}`;
    const cachedData = await RedisService.getJSON<TResponse>(cacheKey);

    if (cachedData) return cachedData;

    const features = new APIFeatures(Variant.find(filter), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const variants = await features.query.lean();

    const result = {
      status: 'success',
      statusCode: 200,
      size: variants.length,
      data: {
        variants,
      },
    };

    await RedisService.setJSON(cacheKey, 3600, result);

    return result;
  }

  async deleteVariant(id: string): Promise<TResponse> {
    const variant = await Variant.findByIdAndDelete(id).lean();

    if (!variant) ResponseFormatter.notFound('No variant found with that id');

    await RedisService.deleteKeys(this.CACHE_PATTERN);

    return {
      status: 'success',
      statusCode: 204,
      message: 'Document deleted successfully',
    };
  }

  async getVariantById(id: string): Promise<TResponse> {
    const cacheKey = `variants:${id}`;
    const cachedData = await RedisService.getJSON<TResponse>(cacheKey);

    if (cachedData) return cachedData;

    const variant = await Variant.findById(id).lean();

    if (!variant) ResponseFormatter.notFound('No variant found with that id');

    const result = {
      status: 'success',
      statusCode: 200,
      data: {
        variant,
      },
    };

    await RedisService.setJSON(cacheKey, 1800, result);

    return result;
  }

  async updateVariant(id: string, data: UpdateVariantBody): Promise<TResponse> {
    const variant = await Variant.findById(id);

    if (!variant) ResponseFormatter.notFound('No variant found with that id');

    variant.set(data);
    const newVariant = await variant.save();

    await RedisService.deleteKeys(this.CACHE_PATTERN);

    return {
      status: 'success',
      statusCode: 200,
      data: {
        variant: newVariant,
      },
    };
  }

  async deleteVariantsWithNoProduct(productId: string) {
    await Variant.deleteMany({ product: productId });

    await RedisService.deleteKeys(this.CACHE_PATTERN);
  }

  async deactivateVariant(id: string): Promise<TResponse> {
    const variant = await Variant.findById(id);

    if (!variant) ResponseFormatter.notFound('No variant found with that id');

    variant.set({
      status: 'inactive',
    });
    const newVariant = await variant.save();

    await RedisService.deleteKeys(this.CACHE_PATTERN);

    return {
      status: 'success',
      statusCode: 200,
      data: {
        variant: newVariant,
      },
    };
  }

  async getActiveVariants(queryString: TQueryString): Promise<TResponse> {
    const result = await this.getAllVariants(queryString, {
      status: 'active',
    });
    return result;
  }

  async getCheapestVariantPerProduct(): Promise<TResponse> {
    const cacheKey = `variants:cheapest`;
    const cachedData = await RedisService.getJSON<TResponse>(cacheKey);

    if (cachedData) return cachedData;

    const variants = await Variant.aggregate([
      {
        $sort: { price: 1 },
      },
      {
        $group: {
          _id: '$product',
          variant: { $first: '$$ROOT' },
        },
      },
      {
        $replaceRoot: { newRoot: '$variant' },
      },
    ]);

    const result = {
      status: 'success',
      statusCode: 200,
      data: {
        variants,
      },
    };

    await RedisService.setJSON(cacheKey, 3600, result);

    return result;
  }

  async deleteVariantImages(
    id: string,
    imagesToDelete: string[]
  ): Promise<TResponse> {
    const variant = await Variant.findById(id);
    if (!variant) ResponseFormatter.notFound('No variant found with that id');

    if (!variant.images || !variant.images.length)
      throw new APIError(
        'This variant does not have any images to delete',
        400
      );

    const updatedVariant = await Variant.findByIdAndUpdate(
      id,
      { $pullAll: { images: imagesToDelete } },
      { new: true, runValidators: true }
    );

    if (!updatedVariant)
      ResponseFormatter.internalError('Failed to delete images from variant');

    await RedisService.deleteKeys(this.CACHE_PATTERN);

    return {
      status: 'success',
      statusCode: 200,
      message: 'Images deleted successfully',
      data: {
        variant: updatedVariant,
      },
    };
  }

  async addImagesToVariant(
    id: string,
    imagesToAdd: string[]
  ): Promise<TResponse> {
    const variant = await Variant.findById(id);
    if (!variant) ResponseFormatter.notFound('No variant found with that id');

    const updatedVariant = await Variant.findByIdAndUpdate(
      id,
      { $addToSet: { images: { $each: imagesToAdd } } },
      { new: true, runValidators: true }
    );

    if (!updatedVariant)
      ResponseFormatter.internalError('Failed to add images to variant');

    await RedisService.deleteKeys(this.CACHE_PATTERN);

    return {
      status: 'success',
      statusCode: 200,
      message: 'Images added successfully',
      data: {
        variant: updatedVariant,
      },
    };
  }
}

export default new VariantService();
