import User from "#/models/user.model";

import { CreateUser } from "#/@types/user";
import { RequestHandler } from "express";
import { generateToken } from "#/utils/generateToken";
import { sendVerificationEmail } from "#/utils/sendVerificationEmail";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });

  //send email to verify
  const token = generateToken(6);
  sendVerificationEmail(token, {name:name, email:email, userId: user._id.toString()})

  res.status(201).json({user:{
    id:user._id,
    name:name,
    email:email
  }});
};
