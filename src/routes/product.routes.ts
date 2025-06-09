import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated';
import isAuthorized from '../middlewares/isAuthorized';
import {
  createProduct,
  defineProductSeller,
  getAllProducts,
  getProductById,
  deleteProduct,
} from '../controllers/product.controller';
import { createProductSchema } from '../validation/products.validation';
import validate from '../middlewares/validate';
import { idSchema } from '../validation/base.validation';

const router = express.Router();

router
  .route('/')
  .get(getAllProducts)
  .post(
    isAuthenticated,
    isAuthorized('admin', 'seller'),
    validate(createProductSchema),
    defineProductSeller,
    createProduct
  );

router
  .route('/:id')
  .all(validate(idSchema))
  .get(getProductById)
  .delete(isAuthenticated, isAuthorized('admin'), deleteProduct);

export const productRouter = router;
