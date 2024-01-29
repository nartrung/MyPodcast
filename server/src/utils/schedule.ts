import Audio from "#/models/audio.model";
import AutoGeneratedPlaylist from "#/models/autoGeneratedPlaylist";
import cron from "node-cron";

const generatedPlaylist = async () => {
  const result = await Audio.aggregate([
    { $match: { verified: true } },
    { $sort: { likes: -1 } },
    {
      $sample: { size: 10 },
    },
    {
      $group: {
        _id: "$category",
        audios: { $push: "$$ROOT._id" },
      },
    },
  ]);

  result.map(async (item) => {
    await AutoGeneratedPlaylist.updateOne({ title: item._id }, { $set: { items: item.audios } }, { upsert: true });
  });
};

cron.schedule("0 0 0 * * *", async () => {
  await generatedPlaylist();
});
