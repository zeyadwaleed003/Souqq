import { z } from 'zod';

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
