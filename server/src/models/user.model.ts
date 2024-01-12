import { hash, compare } from "bcrypt";
import { Model, ObjectId, Schema, model } from "mongoose";

interface UserType{
    name:string;
    email:string;
    password:string;
    verified: boolean;
    avatar?: {url: string; publicId: string};
    tokens: string[];
    favorites: ObjectId[];
    followers: ObjectId[];
    followings: ObjectId[];
}

interface Methods{
    comparePassword(password: string): Promise<boolean>
}

const UserSchema = new Schema<UserType, {}, Methods>({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    verified:{
        type: Boolean,
        default: false
    },
    avatar:{
        type: Object,
        url:String,
        publicId: String,
    },
    favorites:[{
        type: Schema.Types.ObjectId,
        ref:"Audio"
    }],
    followers:[{
        type: Schema.Types.ObjectId,
        ref:"User"
    }],
    followings:[{
        type: Schema.Types.ObjectId,
        ref:"User"
    }],
    tokens:[String]
}, {timestamps: true});

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      this.password = await hash(this.password, 10);
    }
    next();
  });
  
  UserSchema.methods.comparePassword = async function (password) {
    return compare(password, this.password);
}

export default model("User", UserSchema) as Model<UserType,{}, Methods>