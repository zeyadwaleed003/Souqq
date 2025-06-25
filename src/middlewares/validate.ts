import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import { fromError } from 'zod-validation-error';

import APIError from '../utils/APIError';

export default (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const error = fromError(result.error);
      throw new APIError(error.message, 400);
    }

    if (result.data.body) req.body = result.data.body;
    next();
  };
