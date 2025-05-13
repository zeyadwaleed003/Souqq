import { Request } from 'express';
import IUser from '../interfaces/user.interface';

export interface IRequest extends Request {
  user?: IUser;
}
