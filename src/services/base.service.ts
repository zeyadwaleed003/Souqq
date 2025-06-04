import { Model } from 'mongoose';

import { TQueryString, TResponse } from '../types/api.types';
import APIError from '../utils/APIError';
import APIFeatures from '../utils/APIFeatures';

class BaseService {
  async getAll<T>(
    Model: Model<T>,
    queryString: TQueryString
  ): Promise<TResponse> {
    const features = new APIFeatures(Model.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

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
    data: object
  ): Promise<TResponse> {
    const doc = await Model.findById(id);

    if (!doc) {
      throw new APIError('No document found with that id', 404);
    }

    doc.set(data);
    const newDoc = await doc.save();

    const result = {
      status: 'success',
      statusCode: 200,
      data: {
        data: newDoc,
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
