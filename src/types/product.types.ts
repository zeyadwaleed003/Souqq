import { Document, Model, Types } from 'mongoose';
import { z } from 'zod';

import {
  createProductSchema,
  updateProductSchema,
} from '../validation/product.validation';

export type ProductDocument = Document & {
  _id: Types.ObjectId;
  name: string;
  sellerId?: Types.ObjectId;
  brand?: string;
  categories: [Types.ObjectId];
  description: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[];
};

export type ProductModel = Model<ProductDocument>;

export type TSellerId = {
  sellerId: Types.ObjectId;
};

export type ProductImages = {
  images: string[];
};

export type CreateProductBody = z.output<typeof createProductSchema>['body'] &
  ProductImages;
export type UpdateProductBody = z.output<typeof updateProductSchema>['body'] &
  ProductImages;
