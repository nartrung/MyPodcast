import User from "#/models/user.model";
import Audio, { AudioType } from "#/models/audio.model";
import { RequestHandler } from "express";
import { ObjectId, PipelineStage, isValidObjectId } from "mongoose";
import Playlist from "#/models/playlist.model";
import History from "#/models/history.model";
import moment from "moment";

export const toggleFollow: RequestHandler = async (req, res) => {
  const userId = req.params;
  const user = await User.findById(userId);
  let status: "followed" | "unfollowed";

  if (!isValidObjectId(userId) || !user) {
    return res.status(422).json({
      success: false,
      error: "User not found",
    });
  }
  const alreadyFollowed = await User.findOne({
    _id: userId,
    followers: req.user.id,
  });

  if (alreadyFollowed) {
    await User.updateOne(
      { _id: userId },
      {
        $pull: { followers: req.user.id },
      }
    );

    status = "unfollowed";
  } else {
    await User.updateOne(
      { _id: userId },
      {
        $addToSet: { followers: req.user.id },
      }
    );

    status = "followed";
  }

  if (status === "followed") {
    await User.updateOne(
      { _id: req.user.id },
      {
        $addToSet: { followings: userId },
      }
    );
  }
  //Remove UserId from Audio's like list
  if (status === "unfollowed") {
    await User.updateOne(
      { _id: req.user.id },
      {
        $pull: { followings: userId },
      }
    );
  }
};

export const getAllUploads: RequestHandler = async (req, res) => {
  const pageNo = req.query.pageNo as string;
  let limit = 20;

  const data = await Audio.find({
    owner: req.user.id,
  })
    .skip(limit * (parseInt(pageNo) - 1))
    .limit(limit)
    .sort("-createdAt");
  const audios = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      description: item.description,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      createdAt: item.createdAt,
      verified: item.verified,
    };
  });
  res.json({
    success: true,
    audios: audios,
  });
};

export const getAllUserUploads: RequestHandler = async (req, res) => {
  const pageNo = req.query.pageNo as string;
  let limit = 20;
  const { userId } = req.params;

  if (!isValidObjectId(userId)) return res.status(422).json({ error: "Invalid User id!" });

  const data = await Audio.find({ owner: userId, verified: true })
    .skip(limit * (parseInt(pageNo) - 1))
    .limit(limit)
    .sort("-createdAt")
    .populate<AudioType<{ name: string; _id: ObjectId }>>("owner");

  const audios = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      description: item.description,
      file: item.file.url,
      poster: item.poster?.url,
      date: item.createdAt,
      owner: { name: item.owner.name, id: item.owner._id },
    };
  });

  res.json({
    success: true,
    audios: audios,
  });
};

export const getUserInfo: RequestHandler = async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) return res.status(422).json({ error: "Invalid User id!" });

  const user = await User.findById(userId);
  if (!user) return res.status(422).json({ error: "User not found!" });

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      followers: user.followers.length,
      avatar: user.avatar?.url,
    },
  });
};

export const getAllUserPlaylists: RequestHandler = async (req, res) => {
  const { userId } = req.params;
  let limit = 20;
  const pageNo = req.query.pageNo as string;

  if (!isValidObjectId(userId)) return res.status(422).json({ error: "Invalid User id!" });

  const playlist = await Playlist.find({
    owner: userId,
    visibility: "public",
  })
    .skip(limit * (parseInt(pageNo) - 1))
    .sort("-createdAt");

  if (!playlist) return res.json({ playlist: [] });

  res.json({
    playlist: playlist.map((item) => {
      return {
        id: item._id,
        title: item.title,
        itemsCount: item.items.length,
        visibility: item.visibility,
      };
    }),
  });
};

export const getRecommendAudios: RequestHandler = async (req, res) => {
  const user = req.user;

  let matchOptions: PipelineStage.Match = {
    $match: { _id: { $exists: true }, verified: true },
  };

  if (user) {
    const userPrevHistories = await History.aggregate([
      { $match: { owner: user.id } },
      { $unwind: "$all" },
      {
        $match: {
          "all.date": {
            $gte: moment().subtract(30, "days").toDate(),
          },
        },
      },
      { $group: { _id: "$all.audio" } },
      {
        $lookup: {
          from: "audios",
          localField: "_id",
          foreignField: "_id",
          as: "audioData",
        },
      },
      { $unwind: "$audioData" },
      {
        $group: {
          _id: null,
          category: { $addToSet: "$audioData.category" },
        },
      },
    ]);

    const categories = userPrevHistories[0]?.category;

    if (categories.length) {
      matchOptions = {
        $match: {
          category: { $in: categories },
          verified: true,
        },
      };
    }
  }

  const audios = await Audio.aggregate([
    matchOptions,
    {
      $sort: { "likes.count": -1 },
    },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $project: {
        _id: 0,
        id: "$_id",
        title: "$title",
        category: "$category",
        file: "$file.url",
        poster: "$poster.url",
        owner: "$owner.name",
      },
    },
  ]);

  res.json({ audios });
};
