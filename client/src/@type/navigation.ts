interface NewUser {
  id: string;
  name: string;
  email: string;
}

interface ForgotPasswordUser {
  id: string;
}

export type AuthStackNavigitionScreen = {
  LogIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  PasswordVerification: {id: ForgotPasswordUser};
  ResetPassword: {id: ForgotPasswordUser};
  EmailVerification: {userInfo: NewUser};
};
