import { Router } from 'express';

import isAuthenticated from '../middlewares/isAuthenticated';
import validate from '../middlewares/validate';
import {
  createReviewSchema,
  updateReviewSchema,
} from '../validation/review.validation';
import isAuthorized from '../middlewares/isAuthorized';
import {
  createReview,
  setProductUserIds,
  getReviews,
  getReviewById,
  deleteReview,
  updateReview,
  getCurrentUserReviews,
  getAiReviewsSummary,
} from '../controllers/review.controller';
import { idSchema, productIdBodySchema } from '../validation/base.validation';

const router = Router({ mergeParams: true });

router.get('/summary', validate(productIdBodySchema), getAiReviewsSummary);

router.get(
  '/me',
  isAuthenticated,
  isAuthorized('admin', 'user'),
  getCurrentUserReviews
);

router
  .route('/')
  .get(getReviews)
  .post(
    isAuthenticated,
    isAuthorized('admin', 'user'),
    setProductUserIds,
    validate(createReviewSchema),
    createReview
  );

router
  .route('/:id')
  .all(validate(idSchema))
  .get(getReviewById)
  .patch(
    isAuthenticated,
    isAuthorized('admin', 'user'),
    validate(updateReviewSchema),
    updateReview
  )
  .delete(isAuthenticated, isAuthorized('admin', 'user'), deleteReview);

export const reviewRouter = router;
