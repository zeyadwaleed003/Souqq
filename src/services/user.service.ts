import { Types } from 'mongoose';
import { User } from '../models/user.model';
import { TQueryString, TResponse } from '../types/api.types';
import {
  CreateUserBody,
  UpdateMeBody,
  UpdateUserBody,
  UserDocument,
} from '../types/user.types';
import { cleanUserData } from '../utils/functions';
import CartService from './cart.service';
import APIFeatures from '../utils/APIFeatures';
import ResponseFormatter from '../utils/responseFormatter';

class UserService {
  async doesUserExist(id: string) {
    const exist = await User.exists({ _id: id });
    return Boolean(exist);
  }

  async getAllUsers(
    queryString: TQueryString,
    filter = {}
  ): Promise<TResponse> {
    const features = new APIFeatures(User.find(filter), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const users = await features.query.lean();

    return {
      status: 'success',
      statusCode: 200,
      size: users.length,
      data: {
        users,
      },
    };
  }

  async getUser(id: string, currUser: UserDocument): Promise<TResponse> {
    const user = await User.findById(id).lean();

    if (!user) ResponseFormatter.notFound('No user found with that id');

    let userData: object = user;
    if (currUser.role !== 'admin') userData = cleanUserData(user);

    return {
      status: 'success',
      statusCode: 200,
      data: {
        user: userData,
      },
    };
  }

  async createUser(data: CreateUserBody): Promise<TResponse> {
    const user = await User.create(data);
    if (!user) ResponseFormatter.internalError('Failed to create the document');

    user.emailVerified = true;

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
    const user = await User.findById(id);

    if (!user) ResponseFormatter.notFound('No user found with that id');

    user.set(data);
    const newUser = await user.save();

    return {
      status: 'success',
      statusCode: 200,
      data: {
        user: newUser,
      },
    };
  }

  async deleteUser(id: string): Promise<TResponse> {
    const user = await User.findByIdAndDelete(id).lean();
    if (!user) ResponseFormatter.notFound('No document found with that id');

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

    if (!userData)
      ResponseFormatter.internalError('Failed to update user data');

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
