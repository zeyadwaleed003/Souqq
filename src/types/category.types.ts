import { Document, Model, Types } from 'mongoose';
import { z } from 'zod';

import {
  createCategorySchema,
  updateCategorySchema,
} from '../validation/category.validation';

export type CategoryDocument = Document & {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  parent: Types.ObjectId | null;
  description?: string;
  coverImage?: string;
  coverImagePublicId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryModel = Model<CategoryDocument>;

export type CoverImage = {
  coverImage: string;
  coverImagePublicId: string;
};

export type CreateCategoryBody = z.output<typeof createCategorySchema>['body'] &
  CoverImage;
export type UpdateCategoryBody = z.output<typeof updateCategorySchema>['body'] &
  CoverImage;
