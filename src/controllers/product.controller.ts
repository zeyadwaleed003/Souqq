import { NextFunction, Request, Response } from "express";
import Product from "../models/product.model";
import catchAsync from "../utils/catchAsync";
import APIError from "../utils/APIError";
import ProductService from "../services/product.service";

export const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await ProductService.findAll();
    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  }
);

export const getProductById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await ProductService.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  }
);

export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newProduct = await ProductService.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newProduct,
      },
    });
  }
);
