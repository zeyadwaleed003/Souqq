import { Document } from 'mongoose';

interface IUser extends Document {
  name: String;
  email: String;
  photo?: String;
  password: String;
  role: String;
  passwordResetToken?: String;
  passwordResetExpires?: Date;
  createPasswordResetToken(): string;
}

export default IUser;
