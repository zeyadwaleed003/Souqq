import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.service';

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await UserService.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
};
