import { z } from 'zod';
import { Request } from 'express';

import { UserDocument } from '../types/user.types';
import { idSchema } from '../validation/base.validation';

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
};

export type IdParams = z.output<typeof idSchema>['params'];
