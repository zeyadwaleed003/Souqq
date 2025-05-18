import { TUser } from '../types/user.types';
import { User } from '../models/user.model';

class UserService {
  async find(): Promise<TUser[]> {
    const users = await User.find();
    return users;
  }
}

export default new UserService();
