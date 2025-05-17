import crypto from 'crypto';
import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

import IUser from '../interfaces/user.interface';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
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
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// Encrypt the password using Bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password.toString(), 12);
  next();
});

userSchema.methods.createPasswordResetToken = function (this: IUser): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

export const User = model<IUser>('User', userSchema);
