import { Router } from "express";
import { validate } from "#/middlewares/validator";
import { CreateUserSchema, VerifyTokenSchema } from "#/utils/validationSchema";
import {
  create,
  verifyEmail,
  reVerifyEmail,
  handleForgotPassword,
  verifyPasswordResetToken,
  changePassword,
} from "#/controllers/user.controller";

const authRouter = Router();

authRouter.post("/register", validate(CreateUserSchema), create);
authRouter.post("/verify-email", validate(VerifyTokenSchema), verifyEmail);
authRouter.post("/reverify-email", reVerifyEmail);
authRouter.post("/forgot-password", handleForgotPassword);
authRouter.post("/verify-pass-token", validate(VerifyTokenSchema), verifyPasswordResetToken);
authRouter.post("/change-password", changePassword);

export default authRouter;
