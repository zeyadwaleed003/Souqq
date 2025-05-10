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
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
});

// Encrypt the password using Bcrypt and delete the passwordConfirm field
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password.toString(), 12);

  this.passwordConfirm = undefined;
  next();
});

export const User = model<IUser>('User', userSchema);
