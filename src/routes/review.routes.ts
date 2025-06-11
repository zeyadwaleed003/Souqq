import express from 'express';

import isAuthenticated from '../middlewares/isAuthenticated';
import validate from '../middlewares/validate';
import { createReviewSchema } from '../validation/review.validation';
import isAuthorized from '../middlewares/isAuthorized';
import {
  createReview,
  setProductUserIds,
  getReviews,
} from '../controllers/review.controller';

const router = express.Router({ mergeParams: true });

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

// router
//   .route('/:id')
//   .all(validate(idSchema))
//   .get(reviewController.getReviewById)
//   .patch(
//     isAuthenticated,
//     validate(updateReviewSchema),
//     reviewController.updateReview
//   )
//   .delete(isAuthenticated, reviewController.deleteReview);

export const reviewRouter = router;
