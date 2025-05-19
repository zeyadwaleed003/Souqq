import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

import { TUser } from '../types/user.types';

const userSchema = new Schema<TUser>({
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
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
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

  this.password = await bcrypt.hash(this.password.toString(), 12);
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

userSchema.methods.setEmailVerified = async function (this: TUser) {
  this.emailVerified = true;
  this.emailVerificationToken = undefined;
  this.emailVerificationTokenExpiresAt = undefined;
  await this.save();
};

userSchema.methods.setResetPassword = async function (
  this: TUser,
  password: string
) {
  this.password = password;
  this.passwordResetToken = undefined;
  this.passwordResetExpiresAt = undefined;
  await this.save();
};
export const User = model<TUser>('User', userSchema);
