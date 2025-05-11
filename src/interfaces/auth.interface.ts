export interface ILogin {
  email: string;
  password: string;
}

export interface ISignupBody extends ILogin {
  name: string;
  passwordConfirm: string;
}
