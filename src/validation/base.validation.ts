import { z } from 'zod';
import { createUserSchema, updateUserSchema } from './user.validation';

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid MongoDB ObjectID' });

export const idSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const createOneSchema = createUserSchema;
export const updateOneSchema = updateUserSchema;
