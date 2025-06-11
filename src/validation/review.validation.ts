import { z } from 'zod';
import { objectIdSchema } from './base.validation';
import BaseService from '../services/base.service';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';

export const reviewFieldsSchema = z
  .object({
    product: objectIdSchema.refine(
      async (productId) => {
        return await BaseService.doesDocumentExist(Product, productId);
      },
      {
        message: 'The provided product id does not match any existing product',
      }
    ),
    user: objectIdSchema.refine(
      async (userId) => {
        return await BaseService.doesDocumentExist(User, userId);
      },
      {
        message: 'The provided user id does not match any existing user',
      }
    ),
    rating: z
      .number()
      .min(1, 'A review rating must be more than or equal to 1')
      .max(5, 'A review rating must be less than or equal to 5'),
    comment: z.string().trim().min(1),
  })
  .strict();

export const createReviewSchema = z.object({
  body: reviewFieldsSchema,
});

export const updateReviewSchema = z.object({
  body: reviewFieldsSchema.partial(),
});
