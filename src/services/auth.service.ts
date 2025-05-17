import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Request } from 'express';

import {
  ILoginBody,
  ISignupBody,
  IResetPasswordBody,
} from '../interfaces/auth.interface';
import { User } from '../models/user.model';
import APIError from '../utils/APIError';
import Email from '../utils/email';
import { generateJWT, hashToken, generateToken } from '../utils/token';
import { IResponse } from '../types/types';
import logger from '../config/logger';

class AuthService {
  async signup(payload: ISignupBody): Promise<IResponse> {
    // Check if the user already existed
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      throw new APIError(
        'This email is already registered. Please use a different email or log in.',
        409
      );
    }

    // create the user based on his email and send an error message if failed
    const user = await User.create(payload);
    if (!user) {
      throw new APIError(
        'Failed to create your account. Please try again later.',
        500
      );
    }

    logger.info(
      'A new user has been created successfully. User Id: ' + user.id
    );

    return {
      status: 'success',
      statusCode: 201,

      // TODO: remove the password field from the response
      data: user,
      message:
        'Account created successfully. Please check your email to verify your account.',
    };
  }

  async login(payload: ILoginBody): Promise<IResponse> {
    const { email, password } = payload;

    // check if the email or password is not provided
    if (!email || !password)
      throw new APIError('Please provide email and password', 400);

    const user = await User.findOne({ email }).select('+password');

    // check if the user actually exists. if so then check if the password is correct
    if (!user || !(await bcrypt.compare(password, user.password as string)))
      throw new APIError('Invalid email or password', 401);

    const jwt = generateJWT(user.id);

    return {
      status: 'success',
      statusCode: 201,
      token: jwt,
    };
  }

  async forgotPassword(payload: Request): Promise<IResponse> {
    // check if there is a user with the provided email address
    const user = await User.findOne({ email: payload.body.email });
    if (!user) {
      throw new APIError('There is no user with this email address.', 404);
    }

    const { token, hashedToken } = generateToken();

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save({ validateBeforeSave: false });

    try {
      const resetURL = `${payload.protocol}://${payload.get('host')}/api/v1/auth/reset-password/${token}`;
      new Email(user, resetURL).sendPasswordReset();

      return {
        status: 'success',
        statusCode: 200,
        message: 'Please check your email for the password reset link.',
      };
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save({ validateBeforeSave: false });

      throw new APIError(
        'There was an error sending the email. Try again later!',
        500
      );
    }
  }

  async resetPassword(payload: IResetPasswordBody): Promise<IResponse> {
    // Hash the provided token to be able to compare it with the hashed token in the database
    const hashedToken = hashToken(payload.token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gte: Date.now() },
    });

    // If the token is wrong or is expired then error happens
    if (!user) {
      throw new APIError('Your reset token is invalid or has expired.', 400);
    }

    user.password = payload.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // TODO: update the passwordChangedAt property!!!

    const jwt = generateJWT(user._id as string);

    return {
      status: 'success',
      statusCode: 200,
      token: jwt,
    };
  }
}

/*
  TODO:
  - logout functionality
  - 
*/

export default new AuthService();
