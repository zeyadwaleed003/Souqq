import { Request } from 'express';
import IUser from '../interfaces/user.interface';

export interface IRequest extends Request {
  user?: IUser;
}

export interface IResponse {
  status: string;
  statusCode: number;
  size?: number;
  message?: string;
  token?: string;
  data?: object;
}
