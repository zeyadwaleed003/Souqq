import express from 'express';

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
  checkProductSellerP,
} from '../controllers/product.controller';
import {
  createProductSchema,
  updateProductSchema,
} from '../validation/product.validation';
import validate from '../middlewares/validate';
import { idSchema } from '../validation/base.validation';

const router = express.Router();

router
  .route('/')
  .get(getAllProducts)
  .post(
    isAuthenticated,
    isAuthorized('admin', 'seller'),
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
    restrictSellerProductPermissions,
    validate(updateProductSchema),
    checkProductSellerP,
    updateProduct
  )
  .delete(isAuthenticated, isAuthorized('admin'), deleteProduct);

export const productRouter = router;
