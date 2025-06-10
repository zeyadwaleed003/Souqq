import { Product } from '../models/product.model';
import { TQueryString, TResponse } from '../types/api.types';
import { CreateProductBody, UpdateProductBody } from '../types/product.types';
import { UserDocument } from '../types/user.types';
import APIError from '../utils/APIError';
import BaseService from './base.service';
import VariantService from './variant.service';

class ProductService {
  async isProductSeller(id: string, user: UserDocument) {
    if (user.role === 'seller') {
      const product = await Product.findById(id);
      if (!product) throw new APIError('No document found with that id', 404);

      if (!product.sellerId || !user._id.equals(product.sellerId))
        throw new APIError(
          'You are not allowed to make actions on this product',
          403
        );
    }
  }

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
    await VariantService.deleteVariantsWithNoProduct(id);

    const result = await BaseService.deleteOne(Product, id);
    return result;
  }

  async updateProduct(id: string, data: UpdateProductBody): Promise<TResponse> {
    const result = await BaseService.updateOne(Product, id, data);
    return result;
  }

  async removeDeletedCategoriesFromProduct(categoryIds: string[]) {
    await Product.updateMany(
      { categories: { $in: categoryIds } },
      { $pull: { categories: { $in: categoryIds } } }
    );
  }

  async deleteProductsWithNoCategories() {
    await Product.deleteMany({ categories: { $size: 0 } });
  }
}

export default new ProductService();
