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
import {
  sendEmailVerifyEmail,
  sendPasswordResetEmail,
} from '../utils/sendEmail';
import {
  hashToken,
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/token';
import { IResponse } from '../types/types';
import logger from '../config/logger';
import { AccessTokenPayload, TUser } from '../types/user.types';
import { cleanUserData } from '../utils/functions';

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

  private async initiateEmailVerification(user: TUser) {
    const { token, hashedToken } = generateToken();
    await sendEmailVerifyEmail(user.name, user.email, token);
    await user.setEmailVerificationToken(hashedToken);
  }

  // FINISHED
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

    await this.initiateEmailVerification(user);

    return {
      status: 'success',
      statusCode: 201,
      message:
        'Account created successfully. Please check your email to verify your account.',
    };
  }

  // FINISHED
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

    if (!user || !(await user.correctPassword(password)))
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

      await this.initiateEmailVerification(user);

      return response;
    }

    const { accessToken, refreshToken } = this.generateJWT(user);
    response.accessToken = accessToken;
    response.refreshToken = refreshToken;

    const data = cleanUserData(user);
    response.data = data;

    return response;
  }

  // FINISHED
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

  // FINISHED
  async forgotPassword(payload: ForgotPasswordBody): Promise<IResponse> {
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
    await sendPasswordResetEmail(user.name, user.email, token);
    await user.setPasswordResetToken(hashedToken);

    return response;
  }

  // FINISHED
  async resetPassword(
    payload: ResetPasswordBody & ResetPasswordParams
  ): Promise<IResponse> {
    const hashedToken = hashToken(payload.token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiresAt: { $gte: Date.now() },
    });

    if (!user) {
      throw new APIError('Your reset token is invalid or has expired.', 401);
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
