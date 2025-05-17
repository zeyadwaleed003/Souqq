export interface IForgotPasswordBody {
  email: string;
}

export interface ILoginBody extends IForgotPasswordBody {
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
