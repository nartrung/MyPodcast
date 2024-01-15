import nodemailer from "nodemailer";
import path from "path";

import {
  MAILTRAP_HOST,
  MAILTRAP_PASS,
  MAILTRAP_USER,
  VERIFICATION_EMAIL_HOST,
} from "#/utils/variables";
import { generateTemplate } from "#/mail/template";

interface Profile {
  name: string;
  email: string;
}
//Send Email to verify the user's account
export const sendVerificationEmail = async (
  token: string,
  profile: Profile
) => {
  const { name, email } = profile;

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
      title: "Welcome to MyPodcast",
      message: `Hello, ${name}, Your account is nearly set up. Please use this code to verify your email address.`,
      banner: "cid:banner",
      logo: "cid:logo",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "MyPodcastLogo.png",
        path: path.join(__dirname, "../mail/images/MyPodcastLogo.png"),
        cid: "logo",
      },
      {
        filename: "MyPodcastBanner.png",
        path: path.join(__dirname, "../mail/images/MyPodcastBanner.png"),
        cid: "banner",
      },
    ],
  });
};

//Send Password reset link to User's Email
export const sendPasswordResetLink = async (token: string, email: string) => {
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
      title: "Password Reset",
      message:
        "We've recieved a request to reset your password. If you didn't make the request, just ignore this message. Otherwise, you can reset your password with the link below.",
      banner: "cid:forgotPassword",
      logo: "cid:logo",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "MyPodcastLogo.png",
        path: path.join(__dirname, "../mail/images/MyPodcastLogo.png"),
        cid: "logo",
      },
      {
        filename: "MyPodcastResetPassword.png",
        path: path.join(__dirname, "../mail/images/MyPodcastResetPassword.png"),
        cid: "forgotPassword",
      },
    ],
  });
};
