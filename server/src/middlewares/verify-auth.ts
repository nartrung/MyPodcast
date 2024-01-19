import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "#/utils/variables";
import User from "#/models/user.model";

export const verifyAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(403).json({
      success: false,
      error: "Can not authorization",
    });
  }

  const paload = verify(token, JWT_SECRET_KEY) as JwtPayload;
  const userId = paload.userId;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(403).json({
      success: false,
      error: "Can not authorization",
    });
  }
  req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
    followers: user.followers.length,
    followings: user.followings.length,
  };
  req.token = token;
  next();
};

export const isVerified: RequestHandler = (req, res, next) => {
  if (!req.user.verified) return res.status(403).json({ error: "Please verify your email account!" });

  next();
};
