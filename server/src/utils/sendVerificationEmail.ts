import EmailVerificationToken from "#/models/emailVerificationToken.model";
import nodemailer from "nodemailer";
import path from "path";

import { MAILTRAP_HOST, MAILTRAP_PASS, MAILTRAP_USER, VERIFICATION_EMAIL_HOST } from "#/utils/variables";
import { generateTemplate } from "#/mail/template";

interface Profile {
  name: string;
  email: string;
  userId: string;
}

export const sendVerificationEmail = async (token: string, profile: Profile) => {
  const { name, email, userId } = profile;

  await EmailVerificationToken.create({
    owner: userId,
    token: token,
  });

  var transport = nodemailer.createTransport({
    host: MAILTRAP_HOST,
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL_HOST,
    html: generateTemplate({
      title: "Welcome to MyMusic",
      message: `Hello, ${name}, Your account is nearly set up. Please use this code to verify your email address.`,
      banner: "cid:banner",
      logo: "cid:logo",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "MyMusicLogo.png",
        path: path.join(__dirname, "../mail/images/MyMusicLogo.png"),
        cid: "logo",
      },
      {
        filename: "MyMusicBanner.png",
        path: path.join(__dirname, "../mail/images/MyMusicBanner.png"),
        cid: "banner",
      },
    ],
  });
};
