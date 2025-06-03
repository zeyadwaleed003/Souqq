import { Document, Model, Types } from 'mongoose';
import { z } from 'zod';

import { updateMeSchema } from '../validation/user.validation';

export type UserDocument = Document & {
  _id: Types.ObjectId;
  googleId?: string;
  name: string;
  email: string;
  active: boolean;
  photo?: string;
  password?: string;
  passwordChangedAt?: Date;
  role: string;
  passwordResetToken?: string;
  passwordResetExpiresAt?: Date;
  emailVerificationToken?: string;
  emailVerificationTokenExpiresAt?: Date;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  'name' | 'email' | 'photo' | 'role' | 'emailVerified' | '_id' | 'createdAt'
>;

export type RefreshTokenPayload = Pick<UserDocument, '_id'>;
export type updateMeBody = z.output<typeof updateMeSchema>['body'];
