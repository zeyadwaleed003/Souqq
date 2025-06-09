import { Document, Model, Types } from 'mongoose';
import { z } from 'zod';
import { createProductSchema } from '../validation/products.validation';

export type VariantDocument = {
  price: number;
  oldPrice?: number;
  stock: number;
  sku?: string;
  //   images: [string];
  status: string;
  size: string;
  color: string;
};

export type ProductDocument = Document & {
  _id: Types.ObjectId;
  name: string;
  sellerId?: Types.ObjectId;
  brand?: string;
  categories: [Types.ObjectId];
  description: string;
  variants: [VariantDocument];
  //   averageRating: number;
  //   reviewsNumber: number;
};

export type ProductModel = Model<ProductDocument>;

export type CreateProductBody = z.output<typeof createProductSchema>['body'];
