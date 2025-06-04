import express from 'express';

import validate from '../middlewares/validate';
import isAuthorized from '../middlewares/isAuthorized';
import isAuthenticated from '../middlewares/isAuthenticated';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getAllCategoriesAdmin,
} from '../controllers/category.controller';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validation/category.validation';
import { idSchema } from '../validation/base.validation';

const router = express.Router();

router.use(isAuthenticated);
router.use(isAuthorized('admin'));

router
  .route('/')
  .get(getAllCategoriesAdmin)
  .post(validate(createCategorySchema), createCategory);

router
  .route('/:id')
  .all(validate(idSchema))
  .get(getCategoryById)
  .patch(validate(updateCategorySchema), updateCategory)
  .delete(deleteCategory);

export const categoryRouter = router;
