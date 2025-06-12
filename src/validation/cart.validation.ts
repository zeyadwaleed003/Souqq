import { z } from 'zod';

import { objectIdSchema } from './base.validation';

const cartItemSchema = z.object({
  variant: objectIdSchema,
  user: objectIdSchema,
});

export const updateItemCartSchema = z.object({
  body: cartItemSchema
    .extend({
      quantity: z.number().int().positive(),
    })
    .strict(),
});

export const removeItemFromCartSchema = z.object({
  body: cartItemSchema.strict(),
});
