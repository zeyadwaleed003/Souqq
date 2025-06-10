import { Document, Model, Types } from 'mongoose';
import { z } from 'zod';
import { createVariantSchema } from '../validation/variant.validation';

export type VariantDocument = Document & {
  _id: Types.ObjectId;
  price: number;
  oldPrice?: number;
  stock: number;
  sku?: string;
  //   images: [string];
  status: string;
  size: string;
  color: string;
  product: Types.ObjectId;
};

export type VariantModel = Model<VariantDocument>;

export type CreateVariantBody = z.output<typeof createVariantSchema>['body'];
