import { Types } from 'mongoose';
import { User } from '../models/user.model';
import { TResponse, UpdateOneBody, CreateOneBody } from '../types/api.types';
import { updateMeBody, UserDocument } from '../types/user.types';
import APIError from '../utils/APIError';
import { cleanUserData } from '../utils/functions';
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

  async getMe(userData: UserDocument): Promise<TResponse> {
    const user = cleanUserData(userData);
    return {
      statusCode: 200,
      status: 'success',
      data: {
        user,
      },
    };
  }

  async updateMe(id: Types.ObjectId, data: updateMeBody): Promise<TResponse> {
    const userData = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!userData) throw new APIError('Failed to update user data', 404);

    const user = cleanUserData(userData);
    return {
      status: 'success',
      statusCode: 200,
      data: {
        user,
      },
    };
  }
}

/*
  TODO:
    - deleteMe: User can delete himself
*/

export default new UserService();
