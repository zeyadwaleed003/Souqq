import { Product } from '../models/products.model';
import { TQueryString, TResponse } from '../types/api.types';
import { CreateProductBody, UpdateProductBody } from '../types/product.types';
import { UserDocument } from '../types/user.types';
import APIError from '../utils/APIError';
import BaseService from './base.service';

class ProductService {
  private restrictSellerCreateFields(data: CreateProductBody) {
    if (data.sellerId)
      throw new APIError('Seller Not allowed to set product sellerId', 403);

    const notAllowedVariantFields = ['status', 'oldPrice'];
    data.variants.forEach((variant) => {
      notAllowedVariantFields.forEach((f) => {
        if (variant[f as keyof typeof variant])
          throw new APIError(`Seller not allowed to set product ${f}`, 403);
      });
    });
  }

  private restrictSellerUpdateFields(data: UpdateProductBody) {
    const allowedFields = ['name', 'brand', 'categories', 'description'];

    const providedFields = Object.keys(data);
    const unauthorizedFields = providedFields.filter(
      (f) => !allowedFields.includes(f)
    );

    if (unauthorizedFields.length)
      throw new APIError(
        `Seller can Only update fields: ${allowedFields.join(', ')}`,
        403
      );
  }

  restrictProductCreationFields(role: string, data: CreateProductBody) {
    if (role === 'seller') {
      this.restrictSellerCreateFields(data);
    }
  }

  restrictProductUpdateFields(role: string, data: UpdateProductBody) {
    if (role === 'seller') {
      this.restrictSellerUpdateFields(data);
    }
  }

  async isProductSeller(id: string, user: UserDocument) {
    if (user.role === 'seller') {
      const product = await Product.findById(id);
      if (!product) throw new APIError('No document found with that id', 404);

      if (!product.sellerId || !user._id.equals(product.sellerId))
        throw new APIError('You are not allowed to update this product', 403);
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
    const result = await BaseService.deleteOne(Product, id);
    return result;
  }

  async updateProduct(id: string, data: UpdateProductBody): Promise<TResponse> {
    const result = await BaseService.updateOne(Product, id, data);
    return result;
  }
}

export default new ProductService();
