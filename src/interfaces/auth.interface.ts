export interface ILoginBody {
  email: string;
  password: string;
}

export interface ISignupBody extends ILoginBody {
  name: string;
  passwordConfirm: string;
}

export interface IResetPasswordBody {
  password: string;
  passwordConfirm: string;
  token: string;
}
