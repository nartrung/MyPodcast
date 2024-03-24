import { Router } from "express";
import { validate } from "#/middlewares/validator";
import { SignInSchema } from "#/utils/validationSchema";
import { create, signIn, getPodcast } from "#/controllers/admin.controller";
import { verifyAdmin } from "#/middlewares/verify-auth";

const adminRouter = Router();

adminRouter.post("/register", create);
adminRouter.post("/sign-in", validate(SignInSchema), signIn);
adminRouter.get("/podcast", verifyAdmin, getPodcast);

export default adminRouter;
