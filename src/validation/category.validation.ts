import { z } from 'zod';

import { objectIdSchema } from './base.validation';
import { Category } from '../models/category.model';

const categoryFieldsSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Category must be at least 3 characters long')
      .max(20, 'Category must not be more than 20 characters long')
      .trim(),
    parent: objectIdSchema.optional(),
    description: z.string().trim().optional(),
    photo: z.string().optional(),
  })
  .strict()
  .superRefine(async (data, ctx) => {
    if (data.parent) {
      const exists = await Category.exists({ _id: data.parent });

      if (!exists) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'No category found with this parent Id',
          path: ['parent'],
        });
      }
    }
  });

export const createCategorySchema = z.object({
  body: categoryFieldsSchema,
});
