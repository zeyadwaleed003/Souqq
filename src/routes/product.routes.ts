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
  addImagesToProduct,
} from '../controllers/product.controller';
import {
  createProductSchema,
  updateProductSchema,
} from '../validation/product.validation';
import validate from '../middlewares/validate';
import {
  imagesSchema,
  idSchema,
  productIdSchema,
} from '../validation/base.validation';
import { reviewRouter } from './review.routes';

const router = Router();

router.use('/:productId/reviews', validate(productIdSchema), reviewRouter);

router.route('/').get(getAllProducts).post(
  isAuthenticated,
  isAuthorized('admin', 'seller'),
  // uploadMultipleImages,
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
    // uploadMultipleImages,
    normalizeCategoriesToArray,
    restrictSellerProductPermissions,
    validate(updateProductSchema),
    checkProductSeller,
    updateProduct
  )
  .delete(isAuthenticated, isAuthorized('admin'), deleteProduct);

router
  .route('/:id/images')
  .all(validate(idSchema), isAuthenticated, isAuthorized('admin', 'seller'))
  .post(/*uploadMultipleImages,*/ checkProductSeller, addImagesToProduct)
  .delete(validate(imagesSchema), checkProductSeller, deleteProductImages);

export const productRouter = router;
