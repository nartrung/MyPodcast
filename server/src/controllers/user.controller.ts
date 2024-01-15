import User from "#/models/user.model";
import EmailVerificationToken from "#/models/emailVerificationToken.model";
import PasswordResetToken from "#/models/passwordResetToken.model";

import { ChangePassword, CreateUser, VerifyToken } from "#/@types/user";
import { RequestHandler } from "express";
import { generateToken } from "#/utils/generateToken";
import { sendVerificationEmail, sendPasswordResetLink } from "#/utils/sendEmail";
import { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "#/utils/variables";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });

  //send email to verify
  const token = generateToken(6);
  await EmailVerificationToken.create({
    owner: user._id,
    token: token,
  });
  sendVerificationEmail(token, {
    name: name,
    email: email,
  });

  res.status(201).json({
    user: {
      id: user._id,
      name: name,
      email: email,
    },
  });
};

//Verify Email
export const verifyEmail: RequestHandler = async (req: VerifyToken, res) => {
  const { token, userId } = req.body;

  //Verify Email and Delete token
  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken) {
    return res.status(403).json({
      message: "Invalid Token",
    });
  }

  const matchToken = verificationToken?.compareToken(token);
  if (!matchToken) {
    return res.status(403).json({
      message: "Invalid Token",
    });
  }

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });

  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.status(201).json({
    message: "Your Email has been verified",
  });
};

//Reverify Email Later
export const reVerifyEmail: RequestHandler = async (req, res) => {
  const { userId } = req.body;
  if (!isValidObjectId(userId)) {
    return res.status(403).json("Invalid User ID");
  }
  const user = await User.findOne({ owner: userId });
  if (!user) {
    return res.status(403).json("Cannot find the user");
  }

  await EmailVerificationToken.findOneAndDelete({
    owner: userId,
  });

  const token = generateToken(6);
  await EmailVerificationToken.create({
    owner: userId,
    token: token,
  });

  sendVerificationEmail(token, {
    name: user.name,
    email: user.email,
  });

  res.status(201).json({
    message: "Please check your Email to take the code.",
  });
};

export const handleForgotPassword: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(403).json({
      message: "Email not exist!",
    });
  }
  const token = generateToken(6);
  await PasswordResetToken.findOneAndDelete({
    owner: user._id,
  });
  //Generate link for user to Reset the password
  await PasswordResetToken.create({
    owner: user._id,
    token: token,
  });

  sendPasswordResetLink(token, user.email);
  res.status(201).json({
    message: "Please check your Email to take the code.",
  });
};

export const verifyPasswordResetToken: RequestHandler = async (req: VerifyToken, res) => {
  const { token, userId } = req.body;

  //Verify Email and Delete token
  const verificationToken = await PasswordResetToken.findOne({
    owner: userId,
  });

  if (!verificationToken) {
    return res.status(403).json({
      message: "Invalid Token",
    });
  }

  const matchToken = verificationToken?.compareToken(token);
  if (!matchToken) {
    return res.status(403).json({
      message: "Invalid Token",
    });
  }

  await PasswordResetToken.findByIdAndDelete(verificationToken._id);

  res.status(201).json({
    valid: true,
    message: "You can change your password now",
  });
};

export const changePassword: RequestHandler = async (req: ChangePassword, res) => {
  const { userId, password } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(403).json({
      message: "User not exist",
    });
  }

  user.password = password;

  user.save();

  res.status(201).json({
    valid: true,
    message: "Change password successful!",
  });
};
