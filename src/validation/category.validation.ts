import { z } from 'zod';

import { objectIdSchema } from './base.validation';
import { Category } from '../models/category.model';

const parentIdSchema = objectIdSchema.optional().refine(
  async (parent) => {
    if (!parent) return true;

    const exists = await Category.exists({ _id: parent });
    return Boolean(exists);
  },
  {
    message: 'No category found with this parent Id',
    path: ['pParent Category Id'],
  }
);

const categoryFieldsSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Category must be at least 3 characters long')
      .max(20, 'Category must not be more than 20 characters long')
      .trim(),
    parent: parentIdSchema,
    description: z.string().trim().optional(),
    image: z.string().trim().optional(),
  })
  .strict();

export const createCategorySchema = z.object({
  body: categoryFieldsSchema,
});

export const updateCategorySchema = z.object({
  body: categoryFieldsSchema.partial(),
});
