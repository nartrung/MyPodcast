import { Model, ObjectId, Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";

interface EmailVerificationType {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const EmailVerificationTokensSchema = new Schema<
  EmailVerificationType,
  {},
  Methods
>({
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
    //Expire Token after 5 minutes
    expires: 300,
    default: Date.now(),
  },
});

EmailVerificationTokensSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await hash(this.token, 10);
  }
  next();
});

EmailVerificationTokensSchema.methods.compareToken = async function (token) {
  return compare(token, this.token);
};

export default model(
  "EmailVerificationToken",
  EmailVerificationTokensSchema
) as Model<EmailVerificationType, {}, Methods>;
