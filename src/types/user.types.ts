import { Document, Model, Types } from 'mongoose';

export type UserDocument = Document & {
  _id: Types.ObjectId;
  googleId?: string;
  name: string;
  email: string;
  photo?: string;
  password?: string;
  passwordChangedAt?: Date;
  role: string;
  passwordResetToken?: string;
  passwordResetExpiresAt?: Date;
  emailVerificationToken?: string;
  emailVerificationTokenExpiresAt?: Date;
  emailVerified: boolean;
  setEmailVerified: () => Promise<void>;
  setResetPassword: (password: string) => Promise<void>;
  setPasswordResetToken: (hashedToken: string) => Promise<void>;
  setEmailVerificationToken: (hashedToken: string) => Promise<void>;
  correctPassword: (cadidatePassword: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<void>;
  changedPasswordAfterJWT: (iat: number) => boolean;
};

export type UserModel = Model<UserDocument>;

export type AccessTokenPayload = Pick<
  UserDocument,
  'name' | 'email' | 'photo' | 'role' | 'emailVerified' | '_id'
>;

export type RefreshTokenPayload = Pick<UserDocument, '_id'>;
