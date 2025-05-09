import { IProduct } from "../interfaces/product.interface";
import Product from "../models/product.model";
import APIError from "../utils/APIError";

class ProductService {
  async findAll(): Promise<IProduct[]> {
    const products = await Product.find();
    return products;
  }

  async create(body: object): Promise<IProduct> {
    const newProduct = await Product.create(body);
    return newProduct;
  }

  async findById(id: string): Promise<IProduct | null> {
    const product = await Product.findById(id);

    if (!product) throw new APIError("No tour found with that ID", 404);

    return product;
  }
}

export default new ProductService();
