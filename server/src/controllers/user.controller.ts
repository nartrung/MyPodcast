import User from "#/models/user.model";
import EmailVerificationToken from "#/models/emailVerificationToken.model";
import nodemailer from "nodemailer";
import path from "path";

import { CreateUser } from "#/@types/user";
import { RequestHandler } from "express";
import { MAILTRAP_PASS, MAILTRAP_USER } from "#/utils/variables";
import { generateToken } from "#/utils/helper";
import { generateTemplate } from "#/mail/template";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });

  const token = generateToken(6);
  await EmailVerificationToken.create({
    owner: user._id,
    token: token,
  })

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });

  transport.sendMail({
    to: user.email,
    from:"MyMusic@myapp.com",
    html: generateTemplate({
      title: "Welcome to MyMusic",
      message:`Hello, ${name}, Your account is nearly set up. Please use this code to verify your email address.`,
      banner:"cid:banner",
      logo:"cid:logo",
      link:"#",
      btnTitle:token
    }),
    attachments:[
      {
        filename:"MyMusicLogo.png",
        path: path.join(__dirname, "../mail/images/MyMusicLogo.png"),
        cid: "logo"
      },
      {
        filename:"MyMusicBanner.png",
        path: path.join(__dirname, "../mail/images/MyMusicBanner.png"),
        cid: "banner"
      },
    ]

  })

  res.status(201).json(user);
};
