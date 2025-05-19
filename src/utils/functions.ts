import { TUser } from '../types/user.types';

export const cleanUserData = (user: TUser) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    photo: user.photo,
    role: user.role,
    emailVerified: user.emailVerified,
  };
};
