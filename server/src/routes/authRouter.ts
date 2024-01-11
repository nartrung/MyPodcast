import { Router } from "express";
import { validate } from "#/middlewares/validator";
import { CreateUserSchema } from "#/utils/validationSchema";
import { create } from "#/controllers/user.controller";

const authRouter = Router();

authRouter.post("/register", validate(CreateUserSchema), create);

export default authRouter;
