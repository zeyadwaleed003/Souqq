import { z } from 'zod';

const userFieldsSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters long')
      .max(30, 'Name must not be more than 30 characters long')
      .trim(),
    email: z.string().email({ message: 'Invalid email address' }).trim(),
    googleId: z.string().optional(),
    photo: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .trim(),
    passwordChangedAt: z.date().optional(),
    role: z.enum(['admin', 'user']).default('user'),
    passwordResetToken: z.string().optional(),
    passwordResetExpiresAt: z.date().optional(),
    emailVerificationToken: z.string().optional(),
    emailVerificationTokenExpiresAt: z.date().optional(),
    emailVerified: z.boolean().default(true),
    active: z.boolean().default(true),
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
      photo: true,
    })
    .partial(),
});
