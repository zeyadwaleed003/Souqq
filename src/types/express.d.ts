import { UserDocument } from './user.types';

declare global {
  namespace Express {
    export interface User extends UserDocument {}
    interface Request {
      user?: UserDocument;
    }
  }
}
