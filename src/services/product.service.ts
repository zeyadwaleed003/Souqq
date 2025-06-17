import { Product } from '../models/product.model';
import { TQueryString, TResponse } from '../types/api.types';
import { CreateProductBody, UpdateProductBody } from '../types/product.types';
import { UserDocument } from '../types/user.types';
import APIFeatures from '../utils/APIFeatures';
import VariantService from './variant.service';
import ResponseFormatter from '../utils/responseFormatter';

class ProductService {
  async doesProductExist(id: string) {
    const exist = await Product.exists({ _id: id });
    return Boolean(exist);
  }

  async updateRatingStats(
    productId: string,
    { quantity, average }: { quantity: number; average: number }
  ) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: quantity,
      ratingsAverage: average,
    });
  }

  async isProductSeller(id: string, user: UserDocument) {
    if (user.role === 'seller') {
      const product = await Product.findById(id).lean();
      if (!product)
        ResponseFormatter.notFound('No document found with that id');

      if (!product.sellerId || !user._id.equals(product.sellerId))
        ResponseFormatter.forbidden(
          'You are not allowed to make actions on this product'
        );
    }
  }

  async createProduct(data: CreateProductBody): Promise<TResponse> {
    const product = await Product.create(data);
    if (!product)
      ResponseFormatter.internalError('Failed to create the document');

    return {
      status: 'success',
      statusCode: 201,
      data: {
        data: product,
      },
    };
  }

  async getAllProducts(
    queryString: TQueryString,
    filter = {}
  ): Promise<TResponse> {
    const features = new APIFeatures(Product.find(filter), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.query.select('-__v').lean();

    return {
      status: 'success',
      statusCode: 200,
      size: products.length,
      data: {
        products,
      },
    };
  }

  async getProductById(id: string): Promise<TResponse> {
    const product = await Product.findById(id).lean();

    if (!product) ResponseFormatter.notFound('No product found with that id');

    return {
      status: 'success',
      statusCode: 200,
      data: {
        data: product,
      },
    };
  }

  async deleteProduct(id: string): Promise<TResponse> {
    await VariantService.deleteVariantsWithNoProduct(id);

    const product = await Product.findByIdAndDelete(id).lean();

    if (!product) ResponseFormatter.notFound('No product found with that id');

    return {
      status: 'success',
      statusCode: 204,
      message: 'Document deleted successfully',
    };
  }

  async updateProduct(id: string, data: UpdateProductBody): Promise<TResponse> {
    const product = await Product.findById(id);

    if (!product) ResponseFormatter.notFound('No product found with that id');

    product.set({
      status: 'inactive',
    });
    const newProduct = await product.save();

    return {
      status: 'success',
      statusCode: 200,
      data: {
        product: newProduct,
      },
    };
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
