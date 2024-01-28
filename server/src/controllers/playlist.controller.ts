import { createNewPlaylistRequest, updatePlaylistRequest } from "#/@types/playlist";
import Playlist from "#/models/playlist.model";
import Audio, { AudioType } from "#/models/audio.model";
import { RequestHandler } from "express";
import { ObjectId } from "mongoose";

export const createPlaylist: RequestHandler = async (req: createNewPlaylistRequest, res) => {
  const { title } = req.body;
  const ownerId = req.user.id;

  await Playlist.create({ title: title, owner: ownerId });

  res.json({
    success: true,
    Playlist: title,
  });
};

export const updatePlaylist: RequestHandler = async (req: updatePlaylistRequest, res) => {
  const { title, visibility } = req.body;
  const playlistId = req.query.playlistId as string;
  const audioId = req.query.audioId as string;
  const ownerId = req.user.id;

  const playlist = await Playlist.findOne({ _id: playlistId, owner: ownerId });
  if (!playlist) {
    return res.status(404).json({
      success: false,
      error: "Playlist not found",
    });
  }

  if (title) playlist.title = title;
  if (visibility) playlist.visibility = visibility;
  playlist.save();
  if (audioId) {
    const audio = await Audio.findOne({
      _id: audioId,
      verified: true,
    });
    if (!audio) {
      return res.status(404).json({
        success: false,
        error: "Audio need to be verified! Please wait for admin to verify the Podcast!",
      });
    }
    await Playlist.findByIdAndUpdate(playlist._id, {
      $addToSet: { items: audioId },
    });
  }
  if (!title && !visibility && !audioId)
    return res.status(422).json({
      success: false,
      error: "Nothing to update",
    });

  res.json({
    success: true,
  });
};

export const deleteAudioOrPlaylist: RequestHandler = async (req, res) => {
  const playlistId = req.query.playlistId as string;
  const audioId = req.query.audioId as string;
  const ownerId = req.user.id;

  const playlist = await Playlist.findOne({ _id: playlistId, owner: ownerId });
  if (!playlist) {
    return res.status(404).json({
      success: false,
      error: "You cannot modify this playlist",
    });
  }

  if (audioId) {
    const audio = await Audio.findById(audioId);
    if (!audio) {
      return res.status(404).json({
        success: false,
        error: "Audio to delete not found",
      });
    }
    await Playlist.findByIdAndUpdate(playlist._id, {
      $pull: { items: audioId },
    });
    res.json({
      success: true,
      message: "Audio has been deleted",
    });
  } else {
    await Playlist.findByIdAndDelete(playlistId);
    res.json({
      success: true,
      message: "Playlist has been deleted",
    });
  }
};

export const getAllPlaylist: RequestHandler = async (req, res) => {
  const data = await Playlist.find({
    owner: req.user.id,
    visibility: { $ne: "auto" },
  }).sort("-createdAt");

  const playlists = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      itemsCount: item.items.length,
      visibility: item.visibility,
    };
  });
  res.json({
    success: true,
    playlist: playlists,
  });
};

export const getPlaylistAudios: RequestHandler = async (req, res) => {
  const playlistId = req.params.playlistId as string;
  const playlist = await Playlist.findById(playlistId).populate<{
    items: AudioType<{ _id: ObjectId; name: string }>[];
  }>({
    path: "items",
    populate: {
      path: "owner",
      select: "name",
    },
  });

  if (!playlist) {
    res.json({
      success: false,
      error: "Playlist not found",
    });
  } else {
    const audios = playlist.items.map((item) => {
      return {
        id: item._id,
        title: item.title,
        category: item.category,
        owner: { name: item.owner.name, id: item.owner._id },
        file: item.file.url,
        poster: item.poster?.url,
      };
    });
    if (playlist.visibility === "public") {
      res.json({
        success: true,
        audios: audios,
      });
    } else {
      if (playlist.owner.toString() == req.user.id) {
        res.json({
          success: true,
          audios: audios,
        });
      } else {
        res.status(403).json({
          success: false,
          message: "You do not have permission to access this playlist",
        });
      }
    }
  }
};
