import { Request } from 'express';
import { TUser } from '../types/user.types';

export interface IRequest extends Request {
  user?: TUser;
}

export interface IResponse {
  status: string;
  statusCode: number;
  size?: number;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  data?: object;
}
