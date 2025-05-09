import { NextFunction, Request, Response } from 'express';
import Product from '../models/product.model';
import catchAsync from '../utils/catchAsync';

export const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find();

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products,
      },
    });
  }
);

export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newProduct = await Product.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newProduct,
      },
    });
  }
);
