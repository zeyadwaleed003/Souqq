import { Request } from 'express';
import { TUser } from '../types/user.types';

export type TRequest = Request & {
  user: TUser;
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
