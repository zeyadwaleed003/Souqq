import express from 'express';

import validate from '../middlewares/validate';
import isAuthorized from '../middlewares/isAuthorized';
import isAuthenticated from '../middlewares/isAuthenticated';
import { createCategory } from '../controllers/category.controller';
import { createCategorySchema } from '../validation/category.validation';

const router = express.Router();

router.use(isAuthenticated);
router.use(isAuthorized('admin'));

router.route('/').post(validate(createCategorySchema), createCategory);

export const categoryRouter = router;
