import IUser from '../interfaces/user.interface';
import { User } from '../models/user.model';

class AuthService {
  async create(body: object): Promise<IUser> {
    const newUser = await User.create(body);
    return newUser;
  }
}

export default new AuthService();
