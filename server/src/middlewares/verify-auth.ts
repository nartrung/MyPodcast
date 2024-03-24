import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "#/utils/variables";
import User from "#/models/user.model";
import Admin from "#/models/admin.model";
import { access } from "fs";

export const verifyAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(403).json({
      success: false,
      error: "Can not authorization",
    });
  }

  try {
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
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: "Can not authorization",
    });
  }
};

export const verifyAdmin: RequestHandler = async (req, res, next) => {
  const token = req.headers["x-access-token"] as string;
  if (!token) {
    return res.status(403).json({
      success: false,
      error: "Can not authorization",
    });
  }

  try {
    const paload = verify(token, JWT_SECRET_KEY) as JwtPayload;
    const userId = paload.userId;

    const admin = await Admin.findById(userId);
    if (!admin) {
      console.log("loi 1");
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập! Vui lòng thử lại!",
      });
    }
    req.user = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      verified: true,
      followers: 0,
      followings: 0,
    };
    req.token = token;
    next();
  } catch (error) {
    console.log("loi 12");

    return res.status(403).json({
      success: false,
      error: "Có lỗi trong quá trình tải! Vui lòng thử lại!",
    });
  }
};

export const isVerified: RequestHandler = (req, res, next) => {
  if (!req.user.verified) return res.status(403).json({ error: "Please verify your email account!" });

  next();
};
