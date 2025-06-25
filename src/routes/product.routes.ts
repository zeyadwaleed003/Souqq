import { Router } from 'express';

import isAuthenticated from '../middlewares/isAuthenticated';
import isAuthorized from '../middlewares/isAuthorized';
import {
  createProduct,
  defineProductSeller,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  restrictSellerProductPermissions,
  checkProductSeller,
  normalizeCategoriesToArray,
  deleteProductImages,
} from '../controllers/product.controller';
import {
  createProductSchema,
  updateProductSchema,
} from '../validation/product.validation';
import validate from '../middlewares/validate';
import {
  deleteImagesSchema,
  idSchema,
  productIdSchema,
} from '../validation/base.validation';
import { reviewRouter } from './review.routes';
import { uploadMultipleImages } from '../middlewares/upload';

const router = Router();

router.use('/:productId/reviews', validate(productIdSchema), reviewRouter);

router
  .route('/')
  .get(getAllProducts)
  .post(
    isAuthenticated,
    isAuthorized('admin', 'seller'),
    uploadMultipleImages,
    normalizeCategoriesToArray,
    restrictSellerProductPermissions,
    validate(createProductSchema),
    defineProductSeller,
    createProduct
  );

router
  .route('/:id')
  .all(validate(idSchema))
  .get(getProductById)
  .patch(
    isAuthenticated,
    isAuthorized('admin', 'seller'),
    uploadMultipleImages,
    normalizeCategoriesToArray,
    restrictSellerProductPermissions,
    validate(updateProductSchema),
    checkProductSeller,
    updateProduct
  )
  .delete(isAuthenticated, isAuthorized('admin'), deleteProduct);

router
  .route('/:id/images')
  .delete(
    isAuthenticated,
    isAuthorized('admin', 'seller'),
    validate(idSchema),
    validate(deleteImagesSchema),
    checkProductSeller,
    deleteProductImages
  );

export const productRouter = router;
