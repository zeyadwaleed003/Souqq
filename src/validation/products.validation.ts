import { z } from 'zod';

import { objectIdSchema } from './base.validation';
import { User } from '../models/user.model';

const variantFieldsSchema = z
  .object({
    price: z.number().positive(),
    oldPrice: z.number().positive().optional(),
    stock: z.number().positive(),
    sku: z.string().trim().optional(),
    size: z.string().trim().optional(),
    color: z.string().trim().optional(),
    status: z
      .enum(['active', 'inactive', 'draft', 'out-of-stock'])
      .optional()
      .default('draft'),
  })
  .strict()
  .refine((data) => data.color || data.size, {
    message: 'A variant must have a variant theme',
  })
  .refine(
    (data) => !data.oldPrice || (data.oldPrice && data.oldPrice > data.price),
    {
      message: 'The old price must be greater than the current sale price',
    }
  );

const productFieldsSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters long')
      .max(30, 'Name must not be more than 30 characters long')
      .trim(),
    brand: z
      .string()
      .min(3, 'Brand must be at least 3 characters long')
      .max(20, 'Brand must not be more than 10 characters long')
      .trim()
      .optional(),
    categories: z.array(objectIdSchema),
    description: z.string().trim().optional(),
    variants: z.array(variantFieldsSchema).min(1),
    sellerId: objectIdSchema.optional().refine(
      async (sellerId) => {
        if (sellerId) {
          const exists = await User.exists({ _id: sellerId });
          return exists;
        }

        return true;
      },
      {
        message: 'No seller found with this seller id',
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
