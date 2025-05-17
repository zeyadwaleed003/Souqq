import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import { fromError } from 'zod-validation-error';

import APIError from '../utils/APIError';

export default (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
      });

      next();
    } catch (err) {
      // zod-validation-error: wraps zod validation errors in user-friendly readable messages
      const error = fromError(err);
      throw new APIError(error.message, 400);
    }
  };
