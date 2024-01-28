import { Model, ObjectId, Schema, model, models } from "mongoose";
import { ref } from "yup";

export type history = {
  audio: ObjectId;
  progress: Number;
  date: Date;
};

interface HistoryType {
  owner: ObjectId;
  last: history;
  all: history[];
}

const HistorySchema = new Schema<HistoryType>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    last: {
      audio: {
        type: Schema.Types.ObjectId,
        ref: "Audio",
      },
      progress: {
        type: Number,
      },
      date: {
        type: Date,
        required: true,
      },
    },
    all: [
      {
        audio: {
          type: Schema.Types.ObjectId,
          ref: "Audio",
        },
        progress: {
          type: Number,
        },
        date: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const History = models.History || model("History", HistorySchema);
export default History as Model<HistoryType>;
