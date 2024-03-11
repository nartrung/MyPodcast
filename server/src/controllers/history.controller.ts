import { RequestHandler } from "express";
import History, { history } from "#/models/history.model";

export const updateHistory: RequestHandler = async (req, res) => {
  const oldHistory = await History.findOne({ owner: req.user.id });

  const audio = req.body.audioId;
  const progress = req.body.progress;
  const date = new Date();

  const history: history = { audio, progress, date };

  if (!oldHistory) {
    await History.create({
      owner: req.user.id,
      last: history,
      all: [history],
    });
    return res.json({
      success: true,
      message: "Created a new history",
    });
  }

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const histories = await History.aggregate([
    { $match: { owner: req.user.id } },
    { $unwind: "$all" },
    {
      $match: {
        "all.date": {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      },
    },
    {
      $project: {
        _id: 0,
        audioId: "$all.audio",
      },
    },
  ]);

  const sameDayHistory = histories.find(({ audioId }) => audioId.toString() === audio);

  if (sameDayHistory) {
    await History.findOneAndUpdate(
      {
        owner: req.user.id,
        "all.audio": audio,
      },
      {
        $set: {
          "all.$.progress": progress,
          "all.$.date": date,
        },
      }
    );
    await History.findByIdAndUpdate(oldHistory._id, {
      last: history,
    });
    res.json({ success: true, message: "Updated today's history" });
  } else {
    await History.findByIdAndUpdate(oldHistory._id, {
      $push: { all: { $each: [history], $position: 0 } },
      $set: { last: history },
    });
    res.json({ success: true, message: "Added to today's history" });
  }
};

export const deleteHistory: RequestHandler = async (req, res) => {
  //history?all=yes
  const removeAll = req.query.all === "yes";

  if (removeAll) {
    await History.findOneAndDelete({ owner: req.user.id });
    return res.json({
      success: true,
      message: "Deleted all histories",
    });
  }
  //history?audioId=abc
  const audioId = req.query.audioId;
  const result = await History.findOneAndUpdate(
    { owner: req.user.id },
    {
      $pull: { all: { _id: audioId } },
    }
  );

  if (result) {
    return res.json({
      success: true,
      message: "Deleted audio from histories",
    });
  } else {
    return res.status(422).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};
export const getAllHistories: RequestHandler = async (req, res) => {
  const pageNo = (req.query.pageNo as string) ?? "1";
  const limit = 100;

  const histories = await History.aggregate([
    { $match: { owner: req.user.id } },
    {
      $project: {
        all: {
          $slice: ["$all", (parseInt(pageNo) - 1) * limit, limit],
        },
      },
    },
    { $unwind: "$all" },
    {
      $lookup: {
        from: "audios",
        localField: "all.audio",
        foreignField: "_id",
        as: "audioInfo",
      },
    },
    {
      $unwind: "$audioInfo",
    },
    {
      $project: {
        _id: 0,
        id: "$all._id",
        date: "$all.date",
        audioId: "$audioInfo._id",
        title: "$audioInfo.title",
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%d-%m-%Y",
            date: "$date",
          },
        },
        audios: {
          $push: "$$ROOT",
        },
      },
    },
    {
      $project: {
        _id: 0,
        id: "$id",
        date: "$_id",
        audios: "$$ROOT.audios",
      },
    },
    {
      $sort: { date: -1 },
    },
  ]);

  res.json({
    histories,
  });
};

export const getRecentlyPlayed: RequestHandler = async (req, res) => {
  const audios = await History.aggregate([
    { $match: { owner: req.user.id } },
    {
      $project: {
        myHistory: { $slice: ["$all", 20] },
      },
    },
    {
      $project: {
        histories: {
          $sortArray: {
            input: "$myHistory",
            sortBy: { date: -1 },
          },
        },
      },
    },
    {
      $unwind: { path: "$histories", includeArrayIndex: "index" },
    },
    {
      $lookup: {
        from: "audios",
        localField: "histories.audio",
        foreignField: "_id",
        as: "audioInfo",
      },
    },
    {
      $unwind: "$audioInfo",
    },
    {
      $lookup: {
        from: "users",
        localField: "audioInfo.owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $project: {
        _id: 0,
        id: "$audioInfo._id",
        title: "$audioInfo.title",
        file: "$audioInfo.file.url",
        poster: "$audioInfo.poster.url",
        category: "$audioInfo.category.url",
        owner: "$owner.name",
        ownerId: "$owner._id",
        date: "$histories.date",
        progress: "$histories.progress",
      },
    },
  ]);

  res.json({ audios });
};
