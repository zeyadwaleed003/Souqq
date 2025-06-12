import { Types } from 'mongoose';
import { User } from '../models/user.model';
import { TQueryString, TResponse } from '../types/api.types';
import {
  CreateUserBody,
  UpdateMeBody,
  UpdateUserBody,
  UserDocument,
} from '../types/user.types';
import APIError from '../utils/APIError';
import { cleanUserData } from '../utils/functions';
import BaseService from './base.service';
import CartService from './cart.service';

class UserService {
  async getAllUsers(queryString: TQueryString): Promise<TResponse> {
    const result = await BaseService.getAll(User, queryString);
    return result;
  }

  async getUser(id: string): Promise<TResponse> {
    const result = await BaseService.getOne(User, id);
    return result;
  }

  async createUser(data: CreateUserBody): Promise<TResponse> {
    const user = await User.create(data);
    if (!user) throw new APIError('Failed to create the document', 404);

    CartService.createCart(user._id);

    return {
      status: 'success',
      statusCode: 201,
      data: {
        user,
      },
    };
  }

  async updateUser(id: string, data: UpdateUserBody): Promise<TResponse> {
    const result = await BaseService.updateOne(User, id, data);
    return result;
  }

  async deleteUser(id: string): Promise<TResponse> {
    const user = await User.findByIdAndDelete(id).lean();
    if (!user) throw new APIError('No document found with that id', 404);

    CartService.deleteCart(id);

    return {
      status: 'success',
      statusCode: 204,
      message: 'Document deleted successfully',
    };
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

  async updateMe(id: Types.ObjectId, data: UpdateMeBody): Promise<TResponse> {
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

  async deleteMe(id: Types.ObjectId): Promise<TResponse> {
    await User.findByIdAndUpdate(id, { active: false });

    return {
      status: 'success',
      statusCode: 204,
      message: 'User has been deleted successfully.',
    };
  }

  async checkIfSeller(id: string): Promise<boolean> {
    const user = await User.findById(id).lean();
    return Boolean(user && user.role === 'seller');
  }
}

export default new UserService();
