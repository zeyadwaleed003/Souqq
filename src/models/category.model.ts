import { Schema, Types, model } from 'mongoose';
import slugify from 'slugify';

import { CategoryDocument, CategoryModel } from '../types/category.types';

const categorySchema = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: [true, 'A Category must have a name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    parent: {
      type: Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    description: String,
    image: String,
  },
  { timestamps: true }
);

categorySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

export const Category = model<CategoryDocument, CategoryModel>(
  'Category',
  categorySchema
);
