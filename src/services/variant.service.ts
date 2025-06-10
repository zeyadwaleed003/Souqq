import { Variant } from '../models/variant.model';
import { TQueryString, TResponse } from '../types/api.types';
import { CreateVariantBody, UpdateVariantBody } from '../types/variant.types';
import BaseService from './base.service';

class VariantService {
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
}

export default new VariantService();
