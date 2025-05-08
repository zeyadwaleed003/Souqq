import { Request, Response } from 'express';
import Product from '../models/product.model';

export const getAllProducts = async (req: Request, res: Response) => {
 try {
  const products = await Product.find();

  res.status(200).json({
   status: 'success',
   results: products.length,
   data: {
    products,
   },
  });
 } catch (err) {
  res.status(404).json({
   status: 'fail',
   message: err,
  });
 }
};

export const createProduct = async (req: Request, res: Response) => {
 try {
  const newProduct = await Product.create(req.body);
  res.status(201).json({
   status: 'success',
   data: {
    tour: newProduct,
   },
  });
 } catch (err) {
  res.status(400).json({
   status: 'fail',
   message: err,
  });
 }
};
