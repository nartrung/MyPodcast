interface NewUser {
  id: string;
  name: string;
  email: string;
}

export type AuthStackNavigitionScreen = {
  LogIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  PasswordVerification: undefined;
  EmailVerification: {userInfo: NewUser};
};
