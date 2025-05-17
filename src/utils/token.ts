import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import env from '../config/env';

export const generateJWT = (id: string): string => {
  return jwt.sign(
    { id },
    env.JWT_SECRET as string,
    {
      expiresIn: `${env.JWT_EXPIRES_IN}d`,
    } as object
  );
};

export const verifyJWT = (token: string): any => {
  return jwt.verify(token, env.JWT_SECRET as string);
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
