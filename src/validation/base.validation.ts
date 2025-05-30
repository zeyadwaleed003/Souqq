import { z } from 'zod';
import { createUserSchema, updateUserSchema } from './user.validation';

export const idSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid MongoDB ObjectID' }),
  }),
});

export const createOneSchema = createUserSchema; // createUserSchema | createProductSchema | ...
export const updateOneSchema = updateUserSchema; // updateUserSchema | updateProductSchema | ...
