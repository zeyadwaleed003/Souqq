export interface ILoginBody {
  email: string;
  password: string;
}

export interface ISignupBody extends ILoginBody {
  name: string;
  passwordConfirm: string;
}
