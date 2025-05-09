import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
} from '../controllers/product.controller';

const router = express.Router();

router.route('/').get(getAllProducts).post(createProduct);
router.get('/:id', getProductById);
export const productRouter = router;
