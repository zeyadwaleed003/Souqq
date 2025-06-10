import express from 'express';

import validate from '../middlewares/validate';
import isAuthorized from '../middlewares/isAuthorized';
import isAuthenticated from '../middlewares/isAuthenticated';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getAllCategories,
  getSubcategories,
  getCategoryBySlug,
  getCategoryProducts,
  getTopLevelCategories,
} from '../controllers/category.controller';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validation/category.validation';
import { idSchema, querySchema } from '../validation/base.validation';

const router = express.Router();

router.get('/top-level', validate(querySchema), getTopLevelCategories);
router.get('/slug/:slug', getCategoryBySlug);

router
  .route('/')
  .get(validate(querySchema), getAllCategories)
  .post(
    isAuthenticated,
    isAuthorized('admin'),
    validate(createCategorySchema),
    createCategory
  );

router
  .route('/:id')
  .all(validate(idSchema))
  .get(getCategoryById)
  .patch(
    isAuthenticated,
    isAuthorized('admin'),
    validate(updateCategorySchema),
    updateCategory
  )
  .delete(isAuthenticated, isAuthorized('admin'), deleteCategory);

router.get('/:id/subcategories', validate(idSchema), getSubcategories);
router.get('/:id/products', validate(idSchema), getCategoryProducts);

export const categoryRouter = router;
