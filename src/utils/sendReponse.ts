import { Response } from 'express';
import { IResponse } from '../types/types';

export default (data: IResponse, res: Response) => {
  res.status(data.statusCode).json({
    status: data.status,
    size: data.size,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    message: data.message,
    data: data.data,
  });
};
