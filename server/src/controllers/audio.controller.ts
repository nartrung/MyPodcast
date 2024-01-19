import cloudinary from "#/cloud";
import { RequestHandler } from "express";
import formidable from "formidable";
import Audio from "#/models/audio.model";
import { uploadAudioRequest } from "#/@types/audio";

export const uploadNewAudio: RequestHandler = async (req: uploadAudioRequest, res) => {
  const { title, description, category } = req.body;
  const poster = req.files?.poster as formidable.File;
  const audioFile = req.files?.file as formidable.File;
  const ownerId = req.user.id;

  if (!audioFile) return res.status(422).json({ success: false, error: "Audio file is missing!" });

  const audioRespone = await cloudinary.uploader.upload(audioFile.filepath, {
    resource_type: "video",
  });
  const newAudio = new Audio({
    title: title,
    description: description,
    category: category,
    owner: ownerId,
    file: { url: audioRespone.secure_url, publicId: audioRespone.public_id },
  });

  if (poster) {
    const posterRes = await cloudinary.uploader.upload(poster.filepath, {
      width: 400,
      height: 400,
      crop: "thumb",
      gravity: "face",
      folder: "MyPodcast",
    });

    newAudio.poster = {
      url: posterRes.secure_url,
      publicId: posterRes.public_id,
    };
  }

  await newAudio.save();

  res.status(201).json({
    success: true,
    audio: {
      title,
      description,
      file: newAudio.file.url,
      poster: newAudio.poster?.url,
    },
  });
};

export const updateAudio: RequestHandler = async (req: uploadAudioRequest, res) => {
  const { title, description, category } = req.body;
  const poster = req.files?.poster as formidable.File;
  const ownerId = req.user.id;
  const { audioId } = req.params;

  const audio = await Audio.findOne({ _id: audioId, owner: ownerId });
  if (!audio) {
    return res.status(404).json({
      success: false,
      error: "Cannot find the Audio",
    });
  }

  if (title) audio.title = title;
  if (description) audio.description = description;
  if (category) audio.category = category;

  if (poster) {
    if (audio.poster?.publicId) {
      await cloudinary.uploader.destroy(audio.poster.publicId);
    }
    const posterRes = await cloudinary.uploader.upload(poster.filepath, {
      width: 400,
      height: 400,
      crop: "thumb",
      gravity: "face",
      folder: "MyPodcast",
    });

    audio.poster = {
      url: posterRes.secure_url,
      publicId: posterRes.public_id,
    };
  }

  await audio.save();

  res.status(201).json({
    success: true,
    message: "Audio has been updated",
    audio: {
      title,
      description,
      file: audio.file.url,
      poster: audio.poster?.url,
    },
  });
};
