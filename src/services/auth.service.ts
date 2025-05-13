import bcrypt from 'bcryptjs';
import { Request } from 'express';

import { ILoginBody, ISignupBody } from '../interfaces/auth.interface';
import IUser from '../interfaces/user.interface';
import { User } from '../models/user.model';
import APIError from '../utils/APIError';
import Email from '../utils/email';

class AuthService {
  async signup(body: ISignupBody): Promise<IUser> {
    const newUser = await User.create(body);
    return newUser;
  }

  async login(body: ILoginBody): Promise<IUser> {
    const { email, password } = body;

    if (!email || !password)
      throw new APIError('Please provide email and password', 400);

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password as string)))
      throw new APIError('Invalid email or password', 404);

    return user;
  }

  async forgotPassword(body: string, req: Request) {
    const user = await User.findOne({ email: body });
    if (!user) {
      throw new APIError('There is no user with this email address.', 404);
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
      new Email(user, resetURL).sendPasswordReset();
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
}

export default new AuthService();
