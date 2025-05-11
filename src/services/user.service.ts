import IUser from '../interfaces/user.interface';
import { User } from '../models/user.model';

class UserService {
  async find(): Promise<IUser[]> {
    const users = await User.find();
    return users;
  }
}

export default new UserService();
