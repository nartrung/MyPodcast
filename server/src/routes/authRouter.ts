import { Router } from "express";
import { validate } from "#/middlewares/validator";
import { CreateUserSchema, VerifyTokenSchema, SignInSchema } from "#/utils/validationSchema";
import {
  create,
  verifyEmail,
  reVerifyEmail,
  handleForgotPassword,
  verifyPasswordResetToken,
  changePassword,
  signIn,
  updateProfile,
  sendProfile,
  logout,
} from "#/controllers/user.controller";
import { verifyAuth } from "#/middlewares/verify-auth";
import uploadFile from "#/middlewares/upload-file";

const authRouter = Router();

authRouter.post("/register", validate(CreateUserSchema), create);
authRouter.post("/verify-email", validate(VerifyTokenSchema), verifyEmail);
authRouter.post("/reverify-email", reVerifyEmail);
authRouter.post("/forgot-password", handleForgotPassword);
authRouter.post("/verify-pass-token", validate(VerifyTokenSchema), verifyPasswordResetToken);
authRouter.post("/change-password", changePassword);
authRouter.post("/sign-in", validate(SignInSchema), signIn);
authRouter.get("/is-auth", verifyAuth, sendProfile);
authRouter.post("/update-profile", verifyAuth, uploadFile, updateProfile);
authRouter.post("/logout", verifyAuth, logout);

export default authRouter;
