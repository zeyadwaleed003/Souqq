import { ISignupBody } from '../interfaces/auth.interface';
import IUser from '../interfaces/user.interface';
import { User } from '../models/user.model';
import APIError from '../utils/APIError';

class AuthService {
  async signup(body: ISignupBody): Promise<IUser> {
    const newUser = await User.create(body);
    return newUser;
  }

  async findOne(body: object): Promise<IUser> {
    const user = await User.findOne(body).select('+password');

    if (!user) throw new APIError('Invalid email or password', 404);

    return user;
  }
}

export default new AuthService();
