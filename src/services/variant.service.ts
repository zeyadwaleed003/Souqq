import { Variant } from '../models/variant.model';
import { TQueryString, TResponse } from '../types/api.types';
import { CreateVariantBody } from '../types/variant.types';
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
}

export default new VariantService();
