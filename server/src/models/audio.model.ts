import { categories, categoriesTypes } from "#/utils/category_types";
import { Model, ObjectId, Schema, model, models } from "mongoose";

export interface AudioType<T = ObjectId> {
  _id: string;
  title: string;
  description: string;
  owner: T;
  file: { url: string; publicId: string };
  poster?: { url: string; publicId: string };
  likes: ObjectId[];
  category: categoriesTypes;
}

const AudioSchema = new Schema<AudioType>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    file: {
      type: Object,
      url: String,
      publicId: String,
      required: true,
    },
    poster: {
      type: Object,
      url: String,
      publicId: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    category: {
      type: String,
      enum: categories,
      default: "Khác",
    },
  },
  { timestamps: true }
);

const Audio = models.Audio || model("Audio", AudioSchema);
export default Audio as Model<AudioType>;
