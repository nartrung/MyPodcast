import Favorite from "#/models/favorite.model";
import Audio, { AudioType } from "#/models/audio.model";
import { RequestHandler } from "express";
import { ObjectId, isValidObjectId } from "mongoose";

export const toggleFavorite: RequestHandler = async (req, res) => {
  const audioId = req.query.audioId as string;
  let status: "liked" | "unliked";

  if (!isValidObjectId(audioId)) return res.status(422).json({ success: false, error: "Audio id is invalid!" });

  const audio = await Audio.findById(audioId);
  if (!audio) return res.status(404).json({ success: false, error: "Resources not found!" });

  // Audio is already in favorite list
  const alreadyExists = await Favorite.findOne({
    owner: req.user.id,
    items: audioId,
  });

  if (alreadyExists) {
    // Remove from favorite list
    await Favorite.updateOne(
      { owner: req.user.id },
      {
        $pull: { items: audioId },
      }
    );

    status = "unliked";
  } else {
    const favorite = await Favorite.findOne({ owner: req.user.id });
    if (favorite) {
      // Add new audio to the favorite list
      await Favorite.updateOne(
        { owner: req.user.id },
        {
          $addToSet: { items: audioId },
        }
      );
    } else {
      // Create favorite list
      await Favorite.create({ owner: req.user.id, items: [audioId] });
    }

    status = "liked";
  }

  //Add UserId to Audio's like list
  if (status === "liked") {
    await Audio.findByIdAndUpdate(audioId, {
      $addToSet: { likes: req.user.id },
    });
  }
  //Remove UserId from Audio's like list
  if (status === "unliked") {
    await Audio.findByIdAndUpdate(audioId, {
      $pull: { likes: req.user.id },
    });
  }

  res.json({ success: true, status });
};

export const getAllFavorites: RequestHandler = async (req, res) => {
  const userId = req.user.id;

  const favoriteAudios = await Favorite.findOne({ owner: userId }).populate<{
    items: AudioType<{ _id: ObjectId; name: string }>[];
  }>({
    path: "items",
    populate: {
      path: "owner",
    },
  });

  if (!favoriteAudios) {
    return res.json({ audios: [] });
  }
  const audios = favoriteAudios.items.map((item) => {
    return {
      id: item._id,
      title: item.title,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      owner: { name: item.owner.name, id: item.owner._id },
    };
  });
  res.json({
    audios: audios,
  });
};

export const isFavorive: RequestHandler = async (req, res) => {
  const audioId = req.params.audioId;

  if (!isValidObjectId(audioId)) {
    return res.status(422).json({
      success: false,
      error: "Invalid Audio ID",
    });
  }

  const favorive = await Favorite.findOne({ owner: req.user.id, items: audioId });
  res.json({
    success: true,
    favorite: favorive ? true : false,
  });
};
