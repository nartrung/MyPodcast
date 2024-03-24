import Admin from "#/models/admin.model";

import { CreateUser, SignIn } from "#/@types/user";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "#/utils/variables";
import Audio, { AudioType } from "#/models/audio.model";
import { ObjectId } from "mongoose";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;
  try {
    const admin = await Admin.create({ name, email, password });
    res.status(201).json({
      success: true,
      user: {
        id: admin._id,
        name: name,
        email: email,
      },
    });
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Email đã được sử dụng",
    });
  }
};

export const signIn: RequestHandler = async (req: SignIn, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.status(403).json({
      success: false,
      error: "Email hoặc mật khẩu không đúng",
    });
  }

  const matchPassword = admin.comparePassword(password);
  if (!matchPassword) {
    return res.status(403).json({
      success: false,
      error: "Email hoặc mật khẩu không đúng",
    });
  }

  const token = jwt.sign({ userId: admin._id }, JWT_SECRET_KEY);
  res.status(201).json({
    success: true,
    message: "Chào mừng trở lại, Admin!",
    token,
  });
};

export const getPodcast: RequestHandler = async (req, res) => {
  const list = await Audio.find({ verified: false })
    .sort("createdAt")
    .populate<AudioType<{ _id: ObjectId; name: string }>>("owner");

  const audios = list.map((item) => {
    return {
      id: item._id,
      title: item.title,
      about: item.description,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      owner: item.owner.name,
      ownerId: item.owner._id,
    };
  });
  res.json(audios);
};
