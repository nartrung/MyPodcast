import {
  createPlaylist,
  deleteAudioOrPlaylist,
  updatePlaylist,
  getAllPlaylist,
  getPlaylistAudios,
} from "#/controllers/playlist.controller";
import { validate } from "#/middlewares/validator";
import { isVerified, verifyAuth } from "#/middlewares/verify-auth";
import { CreateNewPlaylistSchema, UpdateOldPlaylistSchema } from "#/utils/validationSchema";
import { Router } from "express";

const playlistRouter = Router();

playlistRouter.post("/create", verifyAuth, isVerified, validate(CreateNewPlaylistSchema), createPlaylist);
playlistRouter.patch("/update", verifyAuth, validate(UpdateOldPlaylistSchema), updatePlaylist);
playlistRouter.delete("/delete", verifyAuth, deleteAudioOrPlaylist);
playlistRouter.get("/detail/:playlistId", verifyAuth, getPlaylistAudios);
playlistRouter.get("/", verifyAuth, getAllPlaylist);

export default playlistRouter;
