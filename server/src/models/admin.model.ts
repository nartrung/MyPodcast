import { hash, compare } from "bcrypt";
import { Model, Schema, model } from "mongoose";

interface AdminType {
  name: string;
  email: string;
  password: string;
}

interface Methods {
  comparePassword(password: string): Promise<boolean>;
}

const AdminSchema = new Schema<AdminType, {}, Methods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

AdminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  next();
});

AdminSchema.methods.comparePassword = async function (password) {
  return compare(password, this.password);
};

export default model("Admin", AdminSchema) as Model<AdminType, {}, Methods>;
