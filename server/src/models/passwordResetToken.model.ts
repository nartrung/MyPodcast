import { Model, ObjectId, Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";

interface PasswordResetType {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const PasswordResetTokenSchema = new Schema<PasswordResetType, {}, Methods>({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    //Expire Token after60 minutes
    expires: 3600,
    default: Date.now(),
  },
});

PasswordResetTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await hash(this.token, 10);
  }
  next();
});

PasswordResetTokenSchema.methods.compareToken = async function (token) {
  return compare(token, this.token);
};

export default model("PasswordResetToken", PasswordResetTokenSchema) as Model<
  PasswordResetType,
  {},
  Methods
>;
