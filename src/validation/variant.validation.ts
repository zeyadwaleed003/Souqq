import { z } from 'zod';

import { objectIdSchema } from './base.validation';
import ProductService from '../services/product.service';

const variantFieldsSchema = z
  .object({
    product: objectIdSchema.refine(
      async (productId) => {
        return await ProductService.doesProductExist(productId);
      },
      {
        message: 'The provided product id does not match any existing product',
      }
    ),
    price: z.number().positive(),
    oldPrice: z.number().positive().optional(),
    stock: z.number().positive(),
    sku: z.string().trim().optional(),
    size: z.string().trim().optional(),
    color: z.string().trim().optional(),
    status: z
      .enum(['active', 'inactive', 'draft', 'out-of-stock'])
      .optional()
      .default('active'),
  })
  .strict();

export const createVariantSchema = z.object({
  body: variantFieldsSchema
    .refine((data) => data.color || data.size, {
      message: 'A variant must have a variant theme',
    })
    .refine(
      (data) => !data.oldPrice || (data.oldPrice && data.oldPrice > data.price),
      {
        message: 'The old price must be greater than the current sale price',
      }
    ),
});

export const updateVariantSchema = z.object({
  body: variantFieldsSchema.partial(),
});
