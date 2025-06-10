import { z } from 'zod';

import { objectIdSchema } from './base.validation';
import { User } from '../models/user.model';

const productFieldsSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters long')
      .max(50, 'Name must not be more than 30 characters long')
      .trim(),
    brand: z
      .string()
      .min(3, 'Brand must be at least 3 characters long')
      .max(20, 'Brand must not be more than 20 characters long')
      .trim()
      .optional(),
    categories: z.array(objectIdSchema),
    description: z.string().trim().optional(),
    sellerId: objectIdSchema.optional().refine(
      async (sellerId) => {
        if (sellerId) {
          const exists = await User.exists({ _id: sellerId });
          return exists;
        }

        return true;
      },
      {
        message: 'The provided seller id does not match any existing seller',
      }
    ),
  })
  .strict();

export const createProductSchema = z.object({
  body: productFieldsSchema,
});

export const updateProductSchema = z.object({
  body: productFieldsSchema.partial(),
});
