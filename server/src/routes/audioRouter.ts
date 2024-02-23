import { uploadNewAudio, updateAudio, getLatestPodcast } from "#/controllers/audio.controller";
import uploadFile from "#/middlewares/upload-file";
import { validate } from "#/middlewares/validator";
import { isVerified, verifyAuth } from "#/middlewares/verify-auth";
import { UploadAudioSchema, UpdateAudioSchema } from "#/utils/validationSchema";
import { Router } from "express";

const audioRouter = Router();

audioRouter.get("/lastest", getLatestPodcast);
audioRouter.post("/upload", verifyAuth, isVerified, uploadFile, validate(UploadAudioSchema), uploadNewAudio);
audioRouter.patch("/:audioId", verifyAuth, isVerified, uploadFile, validate(UpdateAudioSchema), updateAudio);

export default audioRouter;
