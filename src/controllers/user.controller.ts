import { RequestHandler } from 'express';
import UserService from '../services/user.service';
import sendResponse from '../utils/sendResponse';
import { IdParams, CreateOneBody, UpdateOneBody } from '../types/api.types';
import APIError from '../utils/APIError';
import { updateMeBody } from '../types/user.types';

export const getAllUsers: RequestHandler<{}> = async (req, res, next) => {
  const result = await UserService.getAllUsers();
  sendResponse(result, res);
};

export const getUser: RequestHandler<IdParams> = async (req, res, next) => {
  const result = await UserService.getUser(req.params.id);
  sendResponse(result, res);
};

export const createUser: RequestHandler<{}, {}, CreateOneBody> = async (
  req,
  res,
  next
) => {
  const result = await UserService.createUser(req.body);
  sendResponse(result, res);
};

export const updateUser: RequestHandler<IdParams, {}, UpdateOneBody> = async (
  req,
  res,
  next
) => {
  const result = await UserService.updateUser(req.params.id, req.body);
  sendResponse(result, res);
};

export const deleteUser: RequestHandler<IdParams> = async (req, res, next) => {
  const result = await UserService.deleteUser(req.params.id);
  sendResponse(result, res);
};

export const getMe: RequestHandler<{}> = async (req, res, next) => {
  if (req.user) {
    const result = await UserService.getMe(req.user);
    sendResponse(result, res);
  } else throw new APIError('Authentication failed', 401);
};

export const updateMe: RequestHandler<{}, {}, updateMeBody> = async (
  req,
  res,
  next
) => {
  if (req.user) {
    const result = await UserService.updateMe(req.user._id, req.body);
    sendResponse(result, res);
  } else throw new APIError('Authentication failed', 401);
};
