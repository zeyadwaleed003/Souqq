import { Document } from 'mongoose';

interface IUser extends Document {
  name: String;
  email: String;
  photo?: String;
  password: String;
  passwordConfirm: String | undefined;
}

export default IUser;
