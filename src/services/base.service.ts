import { Model } from 'mongoose';
import { TResponse } from '../types/api.types';
import APIError from '../utils/APIError';
import { CreateUserBody, UpdateUserBody } from '../types/user.types';

class BaseService {
  async getAll<T>(Model: Model<T>): Promise<TResponse> {
    const docs = await Model.find();

    const result = {
      status: 'success',
      statusCode: 200,
      size: docs.length,
      data: {
        data: docs,
      },
    };

    return result;
  }

  async getOne<T>(Model: Model<T>, id: string): Promise<TResponse> {
    const doc = await Model.findById(id);

    if (!doc) {
      throw new APIError('No document found with that id', 404);
    }

    const result = {
      status: 'success',
      statusCode: 200,
      data: {
        data: doc,
      },
    };

    return result;
  }

  async createOne<T>(Model: Model<T>, data: object): Promise<TResponse> {
    const doc = await Model.create(data);
    if (!doc) throw new APIError('Failed to create the document', 404);

    const result = {
      status: 'success',
      statusCode: 201,
      data: {
        data: doc,
      },
    };

    return result;
  }

  async updateOne<T>(
    Model: Model<T>,
    id: string,
    data: UpdateUserBody
  ): Promise<TResponse> {
    const doc = await Model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      throw new APIError('No document found with that id', 404);
    }

    const result = {
      status: 'success',
      statusCode: 200,
      data: {
        data: doc,
      },
    };

    return result;
  }

  async deleteOne<T>(Model: Model<T>, id: string): Promise<TResponse> {
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) throw new APIError('No document found with that id', 404);

    const result = {
      status: 'success',
      statusCode: 204,
      message: 'Document deleted successfully',
    };

    return result;
  }
}

export default new BaseService();
