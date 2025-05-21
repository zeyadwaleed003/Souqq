import { Response } from 'express';
import { TResponse } from '../types/types';

export default (data: TResponse, res: Response) => {
  res.status(data.statusCode).json({
    status: data.status,
    size: data.size,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    message: data.message,
    data: data.data,
  });
};
