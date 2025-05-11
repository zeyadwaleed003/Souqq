import jwt from 'jsonwebtoken';
import env from '../config/env';

export const generateToken = (id: string): string => {
  return jwt.sign(
    { id },
    env.JWT_SECRET as string,
    {
      expiresIn: `${env.JWT_EXPIRES_IN}d`,
    } as object
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, env.JWT_SECRET as string);
};
