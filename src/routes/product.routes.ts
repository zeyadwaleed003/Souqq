import express from 'express';
import {
 createProduct,
 getAllProducts,
} from '../controllers/product.controller';

const router = express.Router();

router.route('/').get(getAllProducts).post(createProduct);

export const productRouter = router;
