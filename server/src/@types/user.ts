import { Request } from "express";

export interface CreateUser extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

export interface VerifyToken extends Request {
  body: {
    token: string;
    userId: string;
  };
}

export interface ChangePassword extends Request {
  body: {
    userId: string;
    password: string;
  };
}
