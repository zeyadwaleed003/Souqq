import { Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  photo?: string;
  password: string;
  role: string;
  passwordResetToken?: string;
  passwordResetExpiresAt?: Date;
  emailVerificationToken?: string;
  emailVerificationTokenExpiresAt?: Date;
  emailVerified: boolean;
  createPasswordResetToken(): string;
}

export default IUser;
