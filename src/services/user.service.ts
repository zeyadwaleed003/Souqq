import { User } from '../models/user.model';
import { TResponse, UpdateOneBody, CreateOneBody } from '../types/api.types';
import BaseService from './base.service';

class UserService {
  async getAllUsers(): Promise<TResponse> {
    const result = await BaseService.getAll(User);
    return result;
  }

  async getUser(id: string): Promise<TResponse> {
    const result = await BaseService.getOne(User, id);
    return result;
  }

  async createUser(data: CreateOneBody): Promise<TResponse> {
    const result = await BaseService.createOne(User, data);
    return result;
  }

  async updateUser(id: string, data: UpdateOneBody): Promise<TResponse> {
    const result = await BaseService.updateOne(User, id, data);
    return result;
  }

  async deleteUser(id: string): Promise<TResponse> {
    const result = await BaseService.deleteOne(User, id);
    return result;
  }
}

export default new UserService();
