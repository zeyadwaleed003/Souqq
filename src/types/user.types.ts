import { Document, Types } from 'mongoose';

export type TUser = Document & {
  _id: Types.ObjectId;
  name: string;
  email: string;
  photo?: string;
  password: string;
  passwordChangedAt?: Date;
  role: string;
  passwordResetToken?: string;
  passwordResetExpiresAt?: Date;
  emailVerificationToken?: string;
  emailVerificationTokenExpiresAt?: Date;
  emailVerified: boolean;
  setEmailVerified: () => Promise<void>;
  setResetPassword: (password: string) => Promise<void>;
};

export type AccessTokenPayload = Pick<
  TUser,
  'name' | 'email' | 'photo' | 'role' | 'emailVerified' | '_id'
>;

export type RefreshTokenPayload = Pick<TUser, '_id'>;
