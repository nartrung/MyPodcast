import { updateHistory, deleteHistory, getAllHistories, getRecentlyPlayed } from "#/controllers/history.controller";
import { validate } from "#/middlewares/validator";
import { verifyAuth } from "#/middlewares/verify-auth";
import { UpdateHistorySchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/", verifyAuth, validate(UpdateHistorySchema), updateHistory);
router.delete("/", verifyAuth, deleteHistory);
router.get("/", verifyAuth, getAllHistories);
router.get("/recently-played", verifyAuth, getRecentlyPlayed);

export default router;
