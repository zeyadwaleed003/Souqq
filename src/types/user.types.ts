import { z } from 'zod';
import { Document, Model, Types } from 'mongoose';

import {
  addressSchema,
  createUserSchema,
  updateMeSchema,
  updateUserSchema,
} from '../validation/user.validation';

export type Address = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

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
  address?: Address;
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

export type UserPhoto = { photo?: string };

export type CreateUserBody = z.output<typeof createUserSchema>['body'] &
  UserPhoto;
export type UpdateUserBody = z.output<typeof updateUserSchema>['body'] &
  UserPhoto;
export type UpdateMeBody = z.output<typeof updateMeSchema>['body'] & UserPhoto;

export type RefreshTokenPayload = Pick<UserDocument, '_id'>;

export type AddressBody = z.output<typeof addressSchema>['body'];
