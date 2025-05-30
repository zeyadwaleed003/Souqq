import { RequestHandler } from 'express';
import UserService from '../services/user.service';
import sendReponse from '../utils/sendReponse';
import { IdParams, CreateOneBody, UpdateOneBody } from '../types/api.types';

export const getAllUsers: RequestHandler<{}> = async (req, res, next) => {
  const result = await UserService.getAllUsers();
  sendReponse(result, res);
};

export const getUser: RequestHandler<IdParams> = async (req, res, next) => {
  const result = await UserService.getUser(req.params.id);
  sendReponse(result, res);
};

export const createUser: RequestHandler<{}, {}, CreateOneBody> = async (
  req,
  res,
  next
) => {
  const result = await UserService.createUser(req.body);
  sendReponse(result, res);
};

export const updateUser: RequestHandler<IdParams, {}, UpdateOneBody> = async (
  req,
  res,
  next
) => {
  const result = await UserService.updateUser(req.params.id, req.body);
  sendReponse(result, res);
};

export const deleteUser: RequestHandler<IdParams> = async (req, res, next) => {
  const result = await UserService.deleteUser(req.params.id);
  sendReponse(result, res);
};
