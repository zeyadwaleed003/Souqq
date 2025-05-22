import { TUser } from './user.types';

declare global {
  namespace Express {
    export interface User extends TUser {}
    interface Request {
      user?: TUser;
    }
  }
}
