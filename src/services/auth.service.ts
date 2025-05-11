import bcrypt from 'bcryptjs';

import { ILogin, ISignupBody } from '../interfaces/auth.interface';
import IUser from '../interfaces/user.interface';
import { User } from '../models/user.model';
import APIError from '../utils/APIError';

class AuthService {
  async signup(body: ISignupBody): Promise<IUser> {
    const newUser = await User.create(body);
    return newUser;
  }

  async login(body: ILogin): Promise<IUser> {
    const { email, password } = body;

    if (!email || !password)
      throw new APIError('Please provide email and password', 400);

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password as string)))
      throw new APIError('Invalid email or password', 404);

    return user;
  }
}

export default new AuthService();
