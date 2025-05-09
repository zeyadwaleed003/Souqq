import { IProduct } from "../interfaces/product.interface";
import Product from "../models/product.model";

class ProductService {
  async getAllProducts(): Promise<IProduct[]> {
    const products = await Product.find();
    return products;
  }

  async createProduct(body: object): Promise<IProduct> {
    const newProduct = await Product.create(body);
    return newProduct;
  }
}

export default new ProductService();
