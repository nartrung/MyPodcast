import { Router } from "express";
import { validate } from "#/middlewares/validator";
import { SignInSchema } from "#/utils/validationSchema";
import { create, signIn, getPodcast, verifyPodcast, deletePodcast } from "#/controllers/admin.controller";
import { verifyAdmin } from "#/middlewares/verify-auth";

const adminRouter = Router();

adminRouter.post("/register", create);
adminRouter.post("/sign-in", validate(SignInSchema), signIn);
adminRouter.get("/podcast", verifyAdmin, getPodcast);
adminRouter.post("/verify/:id", verifyAdmin, verifyPodcast);
adminRouter.delete("/delete/:id", verifyAdmin, deletePodcast);

export default adminRouter;
