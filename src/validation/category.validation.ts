import { z } from 'zod';

import { objectIdSchema } from './base.validation';
import BaseService from '../services/base.service';
import { Category } from '../models/category.model';

const parentIdSchema = objectIdSchema.optional().refine(
  async (parent) => {
    if (!parent) return true;

    const exist = await BaseService.doesDocumentExist(Category, parent);
    return exist;
  },
  {
    message: 'No category found with this parent id',
    path: ['Parent Category Id'],
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
