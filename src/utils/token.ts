import crypto from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';

import env from '../config/env';
import { AccessTokenPayload, RefreshTokenPayload } from '../types/user.types';

const generateJWT = <T extends object>(
  data: T,
  secret: string,
  expiresIn: string
): string => {
  return jwt.sign(data, secret, {
    expiresIn: expiresIn,
  } as object);
};

export const generateAccessToken = (data: AccessTokenPayload): string => {
  return generateJWT(
    data,
    env.ACCESS_TOKEN_SECRET,
    env.ACCESS_TOKEN_EXPIRES_IN
  );
};

export const generateRefreshToken = (data: RefreshTokenPayload): string => {
  return generateJWT(
    data,
    env.REFRESH_TOKEN_SECRET,
    env.REFRESH_TOKEN_EXPIRES_IN
  );
};

const verifyJWT = <T>(
  token: string,
  secret: string
): (T & JwtPayload) | false => {
  try {
    return jwt.verify(token, secret) as T & JwtPayload;
  } catch {
    return false;
  }
};

export const verifyAccessToken = (token: string) => {
  return verifyJWT<AccessTokenPayload>(token, env.ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return verifyJWT<RefreshTokenPayload>(token, env.REFRESH_TOKEN_SECRET);
};

export const hashToken = (token: string): string => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return hashedToken;
};

export const generateToken = (): { token: string; hashedToken: string } => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = hashToken(token);

  return {
    token,
    hashedToken,
  };
};
