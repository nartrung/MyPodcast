import {
  toggleFollow,
  getAllUploads,
  getAllUserUploads,
  getUserInfo,
  getAllUserPlaylists,
  getRecommendAudios,
} from "#/controllers/profile.controller";
import { isVerified, verifyAuth } from "#/middlewares/verify-auth";
import { Router } from "express";

const router = Router();

router.post("/update-follower/:userId", verifyAuth, toggleFollow);
router.get("/all-uploads/:userId", getAllUserUploads);
router.get("/all-playlists/:userId", getAllUserPlaylists);
router.get("/all-uploads", verifyAuth, getAllUploads);
router.get("/info/:userId", getUserInfo);
router.get("/recommended", verifyAuth, getRecommendAudios);

export default router;
