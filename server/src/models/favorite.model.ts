import { Model, ObjectId, Schema, model, models } from "mongoose";

interface FavoriteType {
  owner: ObjectId;
  items: ObjectId[];
}

const FavoriteSchema = new Schema<FavoriteType>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Audio",
      },
    ],
  },
  { timestamps: true }
);

const Favorite = models.Favorite || model("Favorite", FavoriteSchema);
export default Favorite as Model<FavoriteType>;
