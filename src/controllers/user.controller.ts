import { Request, RequestHandler } from 'express';
import UserService from '../services/user.service';
import sendResponse from '../utils/sendResponse';
import { IdParams } from '../types/api.types';
import {
  CreateUserBody,
  UpdateMeBody,
  UpdateUserBody,
  UserPhoto,
} from '../types/user.types';

const assignUserPhoto = (req: Request<{}, {}, UserPhoto>) => {
  if (req.file) {
    req.body.photo = req.file.secure_url;
    req.body.photoPublicId = req.file.public_id;
  }
};

export const getAllUsers: RequestHandler = async (req, res, next) => {
  const result = await UserService.getAllUsers(req.query);
  sendResponse(result, res);
};

export const getUser: RequestHandler<IdParams> = async (req, res, next) => {
  const result = await UserService.getUser(req.params.id, req.user!);
  sendResponse(result, res);
};

export const createUser: RequestHandler<{}, {}, CreateUserBody> = async (
  req,
  res,
  next
) => {
  assignUserPhoto(req);

  const result = await UserService.createUser(req.body);
  sendResponse(result, res);
};

export const updateUser: RequestHandler<IdParams, {}, UpdateUserBody> = async (
  req,
  res,
  next
) => {
  assignUserPhoto(req);

  const result = await UserService.updateUser(req.params.id, req.body);
  sendResponse(result, res);
};

export const deleteUser: RequestHandler<IdParams> = async (req, res, next) => {
  const result = await UserService.deleteUser(req.params.id);
  sendResponse(result, res);
};

export const getMe: RequestHandler = async (req, res, next) => {
  const result = await UserService.getMe(req.user!);
  sendResponse(result, res);
};

export const updateMe: RequestHandler<{}, {}, UpdateMeBody> = async (
  req,
  res,
  next
) => {
  assignUserPhoto(req);

  const result = await UserService.updateMe(req.user!, req.body);
  sendResponse(result, res);
};

export const deleteMe: RequestHandler = async (req, res, next) => {
  const result = await UserService.deleteMe(req.user!._id);
  sendResponse(result, res);
};

export const saveShippingAddress: RequestHandler = async (req, res, next) => {
  const result = await UserService.saveShippingAddress(req.user!._id, req.body);
  sendResponse(result, res);
};
