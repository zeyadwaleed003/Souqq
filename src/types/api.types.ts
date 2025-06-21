import { z } from 'zod';
import { Request } from 'express';

import { UserDocument } from '../types/user.types';
import { idSchema, slugSchema } from '../validation/base.validation';

export type TRequest = Request & {
  user: UserDocument;
};

export type TResponse = {
  status: string;
  statusCode: number;
  size?: number;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  data?: object;
  session?: object;
};

export type TQueryString = {
  sort?: string;
  limit?: string;
  page?: string;
  fields?: string;
} & Record<string, any>; // Need to deal with the any type here!

export type IdParams = z.output<typeof idSchema>['params'];
export type SlugParams = z.output<typeof slugSchema>['params'];
