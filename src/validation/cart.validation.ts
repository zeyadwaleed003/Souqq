import { z } from 'zod';

import { objectIdSchema } from './base.validation';

export const addItemToCartSchema = z.object({
  body: z
    .object({
      variant: objectIdSchema,
      user: objectIdSchema,
      quantity: z.number().int().positive(),
    })
    .strict(),
});
