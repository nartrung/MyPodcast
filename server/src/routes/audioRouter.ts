import { uploadNewAudio, updateAudio } from "#/controllers/audio.controller";
import uploadFile from "#/middlewares/upload-file";
import { validate } from "#/middlewares/validator";
import { isVerified, verifyAuth } from "#/middlewares/verify-auth";
import { UploadAudioSchema, UpdateAudioSchema } from "#/utils/validationSchema";
import { Router } from "express";

const audioRouter = Router();

audioRouter.post("/upload", verifyAuth, isVerified, uploadFile, validate(UploadAudioSchema), uploadNewAudio);
audioRouter.patch("/:audioId", verifyAuth, isVerified, uploadFile, validate(UpdateAudioSchema), updateAudio);

export default audioRouter;
