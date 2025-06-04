import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import { fromError } from 'zod-validation-error';

import APIError from '../utils/APIError';

export default (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (err) {
      const error = fromError(err);
      throw new APIError(error.message, 400);
    }
  };
