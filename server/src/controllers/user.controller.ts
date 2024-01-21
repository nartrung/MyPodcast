import User from "#/models/user.model";
import EmailVerificationToken from "#/models/emailVerificationToken.model";
import PasswordResetToken from "#/models/passwordResetToken.model";

import { ChangePassword, CreateUser, VerifyToken, SignIn } from "#/@types/user";
import { RequestHandler } from "express";
import { generateToken } from "#/utils/generateToken";
import { sendVerificationEmail, sendPasswordResetLink } from "#/utils/sendEmail";
import { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "#/utils/variables";
import { RequestWithFiles } from "#/middlewares/upload-file";
import cloudinary from "#/cloud";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;
  try {
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
      success: true,
      user: {
        id: user._id,
        name: name,
        email: email,
      },
    });
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: "User already exists",
    });
  }
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
      success: false,
      error: "Invalid Token",
    });
  }

  const matchToken = verificationToken?.compareToken(token);
  if (!matchToken) {
    return res.status(403).json({
      success: false,
      error: "Invalid Token",
    });
  }

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });

  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.status(201).json({
    success: false,
    message: "Your Email has been verified",
  });
};

//Reverify Email Later
export const reVerifyEmail: RequestHandler = async (req, res) => {
  const { userId } = req.body;
  if (!isValidObjectId(userId)) {
    return res.status(403).json({
      success: false,
      error: "Invalid User ID",
    });
  }
  const user = await User.findOne({ owner: userId });
  if (!user) {
    return res.status(403).json({
      success: false,
      error: "Cannot find the user",
    });
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
    success: true,
    message: "Please check your Email to take the code.",
  });
};

export const handleForgotPassword: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(403).json({
      success: false,
      error: "Email not exist!",
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
    success: true,
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
      success: false,
      error: "Invalid Token",
    });
  }

  const matchToken = verificationToken?.compareToken(token);
  if (!matchToken) {
    return res.status(403).json({
      success: false,
      error: "Invalid Token",
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
      success: false,
      error: "User not exist",
    });
  }

  user.password = password;

  user.save();

  res.status(201).json({
    valid: true,
    message: "Change password successful!",
  });
};

export const signIn: RequestHandler = async (req: SignIn, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(403).json({
      success: false,
      error: "Wrong Email or Password! Please try again",
    });
  }

  const matchPassword = user.comparePassword(password);
  if (!matchPassword) {
    return res.status(403).json({
      success: false,
      error: "Wrong Email or Password! Please try again",
    });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY);
  user.tokens.push(token);
  await user.save();

  res.status(201).json({
    success: true,
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.followings.length,
    },
    token,
  });
};

export const updateProfile: RequestHandler = async (req: RequestWithFiles, res) => {
  const { name } = req.body;
  const avatar = req.files?.avatar;

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new Error("Something went wrong!");
  }

  if (name) {
    if (typeof name != "string" || name.trim().length < 3) {
      res.status(422).json({
        success: false,
        error: "Invalid name",
      });
    }

    user.name = name;
  }

  if (avatar) {
    if (user.avatar?.publicId) {
      await cloudinary.uploader.destroy(user.avatar?.publicId);
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(avatar.filepath, {
      with: 400,
      height: 400,
      crop: "thumb",
      gravity: "face",
      folder: "MyPodcast",
    });

    user.avatar = { url: secure_url, publicId: public_id };
  }

  await user.save();
  res.status(201).json({
    success: true,
    message: "Profile has been updated",
  });
};

export const sendProfile: RequestHandler = async (req, res) => {
  res.json({
    user: req.user,
  });
};

export const logout: RequestHandler = async (req, res) => {
  const { logoutAll } = req.query;

  const atoken = req.token;
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new Error("Something went wrong");
  }

  if (logoutAll === "yes") {
    user.tokens = [];
  } else {
    user.tokens.filter((token) => token !== atoken);
  }
  await user.save();
  res.status(201).json({
    success: true,
    message: "Logged out!",
  });
};
