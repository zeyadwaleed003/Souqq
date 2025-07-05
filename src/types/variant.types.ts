import { Document, Model, Types } from 'mongoose';
import { z } from 'zod';
import { createVariantSchema } from '../validation/variant.validation';

export type VariantDocument = Document & {
  _id: Types.ObjectId;
  price: number;
  oldPrice?: number;
  stock: number;
  sku?: string;
  images?: string[];
  imagesPublicIds?: string[];
  status: string;
  size: string;
  color: string;
  product: Types.ObjectId;
};

export type VariantModel = Model<VariantDocument>;

export type VariantImages = {
  images: string[];
  imagesPublicIds: string[];
};

export type CreateVariantBody = z.output<typeof createVariantSchema>['body'] &
  VariantImages;
export type UpdateVariantBody = z.output<typeof createVariantSchema>['body'] &
  VariantImages;
