import { z } from 'zod';
import { objectIdSchema } from './base.validation';

const variantFieldsSchema = z
  .object({
    price: z.number(),
    stock: z.number().refine((stock) => stock > 0, {
      message: 'A product must have a stock',
    }),
    sku: z.string().trim().optional(),
    size: z.string().trim().optional(),
    color: z.string().trim().optional(),
  })
  .strict()
  .refine((data) => data.color || data.size, {
    message: 'A variant must have a variant theme',
  });

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
      .max(10, 'Brand must not be more than 10 characters long')
      .trim()
      .optional(),
    categories: z.array(objectIdSchema),
    description: z.string().trim().optional(),
    variants: z.array(variantFieldsSchema),
  })
  .strict();

export const createProductSchema = z.object({
  body: productFieldsSchema,
});
