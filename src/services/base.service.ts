import {
  CreateOneBody,
  TModel,
  TResponse,
  UpdateOneBody,
} from '../types/api.types';
import APIError from '../utils/APIError';

class BaseService {
  async getAll(Model: TModel): Promise<TResponse> {
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

  async getOne(Model: TModel, id: string): Promise<TResponse> {
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

  async createOne(Model: TModel, data: CreateOneBody): Promise<TResponse> {
    const doc = await Model.create(data);

    const result = {
      status: 'success',
      statusCode: 201,
      data: {
        data: doc,
      },
    };

    return result;
  }

  async updateOne(
    Model: TModel,
    id: string,
    data: UpdateOneBody
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

  async deleteOne(Model: TModel, id: string): Promise<TResponse> {
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
