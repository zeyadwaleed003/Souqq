import { Document, Model, Types } from 'mongoose';
import { z } from 'zod';
import { createCategorySchema } from '../validation/category.validation';

export type CategoryDocument = Document & {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  parent: Types.ObjectId | null;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryModel = Model<CategoryDocument>;

export type CreateCategoryBody = z.output<typeof createCategorySchema>['body'];
