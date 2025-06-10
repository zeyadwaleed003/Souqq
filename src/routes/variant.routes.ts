import express from 'express';

import isAuthenticated from '../middlewares/isAuthenticated';
import isAuthorized from '../middlewares/isAuthorized';
import {
  checkProductSellerV,
  createVariant,
  deleteVariant,
  getAllVariants,
  getVariantById,
  restrictSellerVariantPermissions,
  updateVariant,
  deactivateVariant,
} from '../controllers/variant.controller';
import { createVariantSchema } from '../validation/variant.validation';
import { updateVariantSchema } from '../validation/variant.validation';
import validate from '../middlewares/validate';
import { idSchema } from '../validation/base.validation';

const router = express.Router();

router.patch(
  '/:id/deactivate',
  validate(idSchema),
  isAuthenticated,
  isAuthorized('admin'),
  deactivateVariant
);

router
  .route('/')
  .get(getAllVariants)
  .post(
    isAuthenticated,
    isAuthorized('admin', 'seller'),
    validate(createVariantSchema),
    checkProductSellerV,
    restrictSellerVariantPermissions,
    createVariant
  );

router
  .route('/:id')
  .all(validate(idSchema))
  .get(getVariantById)
  .patch(
    isAuthenticated,
    isAuthorized('admin', 'seller'),
    validate(updateVariantSchema),
    checkProductSellerV,
    restrictSellerVariantPermissions,
    updateVariant
  )
  .delete(isAuthenticated, isAuthorized('admin'), deleteVariant);

export const variantRouter = router;
