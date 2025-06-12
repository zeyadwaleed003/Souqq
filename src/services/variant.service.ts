import { Variant } from '../models/variant.model';
import { TQueryString, TResponse } from '../types/api.types';
import {
  CreateVariantBody,
  UpdateVariantBody,
  VariantDocument,
} from '../types/variant.types';
import APIError from '../utils/APIError';
import BaseService from './base.service';

class VariantService {
  async getVariantDetails(variantId: string): Promise<VariantDocument> {
    const variant = await Variant.findById(variantId).lean();
    if (!variant)
      throw new APIError(
        'The provided variant id does not match any existing variant',
        400
      );

    return variant;
  }

  async createVariant(data: CreateVariantBody): Promise<TResponse> {
    const result = await BaseService.createOne(Variant, data);
    return result;
  }

  async getAllVariants(queryString: TQueryString): Promise<TResponse> {
    const result = await BaseService.getAll(Variant, queryString);
    return result;
  }

  async deleteVariant(id: string): Promise<TResponse> {
    const result = await BaseService.deleteOne(Variant, id);
    return result;
  }

  async getVariantById(id: string): Promise<TResponse> {
    const result = await BaseService.getOne(Variant, id);
    return result;
  }

  async updateVariant(id: string, data: UpdateVariantBody): Promise<TResponse> {
    const result = await BaseService.updateOne(Variant, id, data);
    return result;
  }

  async deleteVariantsWithNoProduct(productId: string) {
    await Variant.deleteMany({ product: productId });
  }

  async deactivateVariant(id: string): Promise<TResponse> {
    const variant = await BaseService.updateOne(Variant, id, {
      status: 'inactive',
    });

    return {
      status: 'success',
      statusCode: 200,
      data: {
        variant,
      },
    };
  }

  async getActiveVariants(queryString: TQueryString): Promise<TResponse> {
    const result = await BaseService.getAll(Variant, queryString, {
      status: 'active',
    });
    return result;
  }

  async getCheapestVariantPerProduct(): Promise<TResponse> {
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

    return {
      status: 'success',
      statusCode: 200,
      data: variants,
    };
  }
}

export default new VariantService();
