import { z } from 'zod';
import { stringOrBoolSchema } from './base.validation';

const userFieldsSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters long')
      .max(30, 'Name must not be more than 30 characters long')
      .trim(),
    email: z.string().email({ message: 'Invalid email address' }).trim(),
    googleId: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .trim(),
    role: z.enum(['admin', 'user', 'seller']).default('user'),
    emailVerified: stringOrBoolSchema,
    active: stringOrBoolSchema,
  })
  .strict();

export const createUserSchema = z.object({
  body: userFieldsSchema,
});

export const updateUserSchema = z.object({
  body: userFieldsSchema.partial(),
});

export const updateMeSchema = z.object({
  body: userFieldsSchema
    .pick({
      name: true,
    })
    .partial(),
});
