import { Product } from '../models/products.model';
import { TQueryString, TResponse } from '../types/api.types';
import { CreateProductBody } from '../types/product.types';
import BaseService from './base.service';

class ProductService {
  async createProduct(data: CreateProductBody): Promise<TResponse> {
    const result = await BaseService.createOne(Product, data);
    return result;
  }

  async getAllProducts(queryString: TQueryString): Promise<TResponse> {
    const result = await BaseService.getAll(Product, queryString);
    return result;
  }

  async getProductById(id: string): Promise<TResponse> {
    const result = await BaseService.getOne(Product, id);
    return result;
  }

  async deleteProduct(id: string): Promise<TResponse> {
    const result = await BaseService.deleteOne(Product, id);
    return result;
  }
}

export default new ProductService();
