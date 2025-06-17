import { Variant } from '../models/variant.model';
import { TQueryString, TResponse } from '../types/api.types';
import {
  CreateVariantBody,
  UpdateVariantBody,
  VariantDocument,
} from '../types/variant.types';
import APIFeatures from '../utils/APIFeatures';
import ResponseFormatter from '../utils/responseFormatter';

class VariantService {
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

    return {
      status: 'success',
      statusCode: 201,
      data: {
        data: variant,
      },
    };
  }

  async getAllVariants(
    queryString: TQueryString,
    filter = {}
  ): Promise<TResponse> {
    const features = new APIFeatures(Variant.find(filter), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const variants = await features.query.select('-__v').lean();

    return {
      status: 'success',
      statusCode: 200,
      size: variants.length,
      data: {
        variants,
      },
    };
  }

  async deleteVariant(id: string): Promise<TResponse> {
    const variant = await Variant.findByIdAndDelete(id).lean();

    if (!variant) ResponseFormatter.notFound('No variant found with that id');

    return {
      status: 'success',
      statusCode: 204,
      message: 'Document deleted successfully',
    };
  }

  async getVariantById(id: string): Promise<TResponse> {
    const variant = await Variant.findById(id).lean();

    if (!variant) ResponseFormatter.notFound('No variant found with that id');

    return {
      status: 'success',
      statusCode: 200,
      data: {
        data: variant,
      },
    };
  }

  async updateVariant(id: string, data: UpdateVariantBody): Promise<TResponse> {
    const variant = await Variant.findById(id);

    if (!variant) ResponseFormatter.notFound('No variant found with that id');

    variant.set(data);
    const newVariant = await variant.save();

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
  }

  async deactivateVariant(id: string): Promise<TResponse> {
    const variant = await Variant.findById(id);

    if (!variant) ResponseFormatter.notFound('No variant found with that id');

    variant.set({
      status: 'inactive',
    });
    const newVariant = await variant.save();

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
