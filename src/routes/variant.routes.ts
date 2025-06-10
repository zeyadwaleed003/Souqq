import express from 'express';

import isAuthenticated from '../middlewares/isAuthenticated';
import isAuthorized from '../middlewares/isAuthorized';
import {
  checkProductSellerV,
  createVariant,
  getAllVariants,
  restrictSellerVariantPermissions,
} from '../controllers/variant.controller';
import { createVariantSchema } from '../validation/variant.validation';
import validate from '../middlewares/validate';

const router = express.Router();

router
  .route('/')
  .get(getAllVariants)
  .post(
    isAuthenticated,
    isAuthorized('admin', 'seller'),
    checkProductSellerV,
    restrictSellerVariantPermissions,
    validate(createVariantSchema),
    createVariant
  );

export const variantRouter = router;
