import { Router } from 'express';

import isAuthenticated from '../middlewares/isAuthenticated';
import isAuthorized from '../middlewares/isAuthorized';
import {
  updateVariant,
  createVariant,
  deleteVariant,
  getAllVariants,
  getVariantById,
  deactivateVariant,
  getActiveVariants,
  checkProductSellerV,
  restrictSellerVariantPermissions,
  getCheapestVariantPerProduct,
  addImagesToVariant,
  deleteVariantImages,
} from '../controllers/variant.controller';
import { createVariantSchema } from '../validation/variant.validation';
import { updateVariantSchema } from '../validation/variant.validation';
import validate from '../middlewares/validate';
import {
  idSchema,
  imagesSchema,
  variantIdSchema,
} from '../validation/base.validation';
import { cartRouter } from './cart.routes';
import { uploadMultipleImages } from '../middlewares/upload';

const router = Router();

router.use('/:variantId/carts', validate(variantIdSchema), cartRouter);

router.get('/active', getActiveVariants);
router.get('/cheapest', getCheapestVariantPerProduct);

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
    uploadMultipleImages,
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
    uploadMultipleImages,
    validate(updateVariantSchema),
    checkProductSellerV,
    restrictSellerVariantPermissions,
    updateVariant
  )
  .delete(isAuthenticated, isAuthorized('admin'), deleteVariant);

router
  .route('/:id/images')
  .all(validate(idSchema), isAuthenticated, isAuthorized('admin', 'seller'))
  .post(uploadMultipleImages, checkProductSellerV, addImagesToVariant)
  .delete(validate(imagesSchema), checkProductSellerV, deleteVariantImages);

export const variantRouter = router;
