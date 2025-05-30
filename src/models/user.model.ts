import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

import { UserDocument, UserModel } from '../types/user.types';

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  googleId: String,
  photo: String,
  password: {
    type: String,
    minlength: [
      8,
      'A user password must have a greater or equal than 8 characters',
    ],
    select: false,
    trim: true,
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  passwordResetToken: String,
  passwordResetExpiresAt: Date,
  emailVerificationToken: String,
  emailVerificationTokenExpiresAt: Date,
  emailVerified: {
    type: Boolean,
    default: false,
  },
});

// Encrypt the password using Bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  if (this.password)
    this.password = await bcrypt.hash(this.password.toString(), 10);
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

userSchema.methods.correctPassword = async function (
  this: UserDocument,
  candidatePassword: string
) {
  if (this.password)
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.setEmailVerified = async function (this: UserDocument) {
  this.emailVerified = true;
  this.emailVerificationToken = undefined;
  this.emailVerificationTokenExpiresAt = undefined;
  await this.save();
};

userSchema.methods.setEmailVerificationToken = async function (
  this: UserDocument,
  hashedToken: string
) {
  this.emailVerificationToken = hashedToken;
  this.emailVerificationTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await this.save({ validateBeforeSave: false });
};

userSchema.methods.setResetPassword = async function (
  this: UserDocument,
  password: string
) {
  this.password = password;
  this.passwordResetToken = undefined;
  this.passwordResetExpiresAt = undefined;
  await this.save();
};

userSchema.methods.setPasswordResetToken = async function (
  this: UserDocument,
  hashedToken: string
) {
  this.passwordResetToken = hashedToken;
  this.passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await this.save({ validateBeforeSave: false });
};

userSchema.methods.updatePassword = async function (
  this: UserDocument,
  newPassword: string
) {
  this.password = newPassword;
  await this.save();
};

userSchema.methods.changedPasswordAfterJWT = function (
  this: UserDocument,
  JWTTimestamp: number
) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );

    return JWTTimestamp < passwordChangedTimestamp;
  }

  return false;
};

export const User = model<UserDocument, UserModel>('User', userSchema);
