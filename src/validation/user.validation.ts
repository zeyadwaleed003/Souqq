import { z } from 'zod';
import { stringOrBoolSchema } from './base.validation';

export const addressFieldsSchema = z
  .object({
    address: z
      .string()
      .trim()
      .min(5, 'Address must be at least 5 characters long')
      .max(200, 'Address must not exceed 200 characters'),
    city: z
      .string()
      .trim()
      .min(2, 'City must be at least 2 characters long')
      .max(50, 'City must not exceed 50 characters')
      .regex(
        /^[a-zA-Z\s-']+$/,
        'City can only contain letters, spaces, hyphens, and apostrophes'
      ),
    postalCode: z
      .string()
      .trim()
      .min(3, 'Postal code must be at least 3 characters')
      .max(10, 'Postal code must not exceed 10 characters')
      .regex(/^[A-Z0-9\s-]+$/i, 'Invalid postal code format'),
    country: z
      .string()
      .trim()
      .min(2, 'County must be at least 2 characters long')
      .max(50, 'County must not exceed 50 characters')
      .regex(
        /^[a-zA-Z\s-']+$/,
        'County can only contain letters, spaces, hyphens, and apostrophes'
      ),
  })
  .strict();

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
    address: addressFieldsSchema.optional(),
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
      address: true,
    })
    .partial(),
});

export const addressSchema = z.object({
  body: addressFieldsSchema,
});
