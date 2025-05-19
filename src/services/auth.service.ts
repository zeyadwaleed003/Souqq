import bcrypt from 'bcryptjs';

import {
  LoginBody,
  SignupBody,
  ResetPasswordBody,
  ForgotPasswordBody,
  VerifyEmailParams,
  RefreshTokenBody,
  ResetPasswordParams,
} from '../types/auth.types';
import { User } from '../models/user.model';
import APIError from '../utils/APIError';
import Email from '../utils/email';
import {
  hashToken,
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/token';
import { IResponse } from '../types/types';
import logger from '../config/logger';
import env from '../config/env';
import { TUser } from '../types/user.types';

class AuthService {
  private generateJWT(user: TUser) {
    return {
      accessToken: generateAccessToken({
        _id: user._id,
        email: user.email,
        emailVerified: user.emailVerified,
        name: user.name,
        role: user.role,
        photo: user.photo,
      }),
      refreshToken: generateRefreshToken({
        _id: user._id,
      }),
    };
  }

  async signup(payload: SignupBody): Promise<IResponse> {
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      throw new APIError(
        'This email is already registered. Please use a different email or log in.',
        409
      );
    }

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

    const { token, hashedToken } = generateToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );
    await user.save({ validateBeforeSave: false });

    const verifyURL = `${env.BASE_URL}api/v1/auth/verify-email/${token}`;
    await new Email(user, verifyURL).sendEmailVerify(); // Takes long time because of the await!

    // TODO: handle email failed to send error

    return {
      status: 'success',
      statusCode: 201,
      message:
        'Account created successfully. Please check your email to verify your account.',
    };
  }

  async verifyEmail(payload: VerifyEmailParams): Promise<IResponse> {
    const hashedToken = hashToken(payload.token);

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiresAt: { $gte: Date.now() },
    });

    if (!user) {
      throw new APIError(
        'Your verification token is invalid or has expired.',
        401
      );
    }

    await user.setEmailVerified();

    return {
      status: 'success',
      statusCode: 200,
      message: 'Your email has been successfully verified.',
    };
  }

  async login(payload: LoginBody): Promise<IResponse> {
    const { email, password } = payload;

    const user = await User.findOne({ email }).select('+password');

    // check if the user actually exists. if so then check if the password is correct
    if (!user || !(await bcrypt.compare(password, user.password as string)))
      throw new APIError('Invalid email or password', 401);

    const response: IResponse = {
      status: 'success',
      statusCode: 201,
    };

    if (!user.emailVerified) {
      response.status = 'error';
      response.statusCode = 403;
      response.message =
        'Your email is not verified, please check your email for the verification link.';

      return response;
    }

    const { accessToken, refreshToken } = this.generateJWT(user);

    response.accessToken = accessToken;
    response.refreshToken = refreshToken;
    return response;
  }

  async refreshToken(payload: RefreshTokenBody): Promise<IResponse> {
    const tokenPayload = verifyRefreshToken(payload.refreshToken);
    if (!tokenPayload) {
      throw new APIError('Your refresh token is invalid or has expired.', 401);
    }

    const user = await User.findById(tokenPayload);
    if (!user) {
      throw new APIError(
        'The account you are trying to access is no longer available',
        401
      );
    }

    const { accessToken } = this.generateJWT(user);

    return {
      status: 'success',
      statusCode: 200,
      accessToken,
    };
  }

  async forgotPassword(payload: ForgotPasswordBody): Promise<IResponse> {
    // check if there is a user with the provided email address
    const user = await User.findOne({ email: payload.email });

    const response = {
      status: 'success',
      statusCode: 200,
      message: 'Please check your email for the password reset link.',
    };

    if (!user) {
      logger.error(
        `No user found with email: ${payload.email} for password reset request`
      );
      return response;
    }

    const { token, hashedToken } = generateToken();

    user.passwordResetToken = hashedToken;
    user.passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const resetURL = `${env.BASE_URL}api/v1/auth/reset-password/${token}`;
    await new Email(user, resetURL).sendPasswordReset();

    return response;

    // TODO: handle email failed to send error

    // user.passwordResetToken = undefined;
    // user.passwordResetExpiresAt = undefined;

    // await user.save({ validateBeforeSave: false });

    // throw new APIError(
    //   'There was an error sending the email. Try again later!',
    //   500
    // );
  }

  async resetPassword(
    payload: ResetPasswordBody & ResetPasswordParams
  ): Promise<IResponse> {
    const hashedToken = hashToken(payload.token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiresAt: { $gte: Date.now() },
    });

    if (!user) {
      throw new APIError('Your reset token is invalid or has expired.', 400);
    }

    await user.setResetPassword(payload.password);

    const { accessToken, refreshToken } = this.generateJWT(user);

    return {
      status: 'success',
      statusCode: 200,
      accessToken,
      refreshToken,
    };
  }
}

export default new AuthService();
