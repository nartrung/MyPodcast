import * as yup from "yup";
import { isValidObjectId } from "mongoose";
import { categories } from "./category_types";

export const CreateUserSchema = yup.object().shape({
  name: yup.string().trim().required("Name is required.It cannot be empty!"),
  email: yup.string().required("Email is required.It cannot be empty!").email("Invalid Email!"),
  password: yup
    .string()
    .trim()
    .required("Password is missing!")
    //Minimum eight characters, at least one letter, one number and one special character
    .min(8, "Password is too short!")
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/, "Password is too simple!"),
});

export const VerifyTokenSchema = yup.object().shape({
  token: yup.string().trim().required("Token is required!!"),
  userId: yup
    .string()
    .transform(function (value) {
      return this.isType(value) && isValidObjectId(value) ? value : "";
    })
    .required("User ID cannot be empty"),
});

export const SignInSchema = yup.object().shape({
  email: yup.string().required("Email is required.It cannot be empty!").email("Invalid Email!"),
  password: yup.string().trim().required("Password is missing!"),
});

export const UploadAudioSchema = yup.object().shape({
  title: yup.string().required("Title is required.It cannot be empty!"),
  description: yup.string().required("Description is required.It cannot be empty!"),
  category: yup.string().oneOf(categories).required("Category is required. It cannot be empty"),
});

export const UpdateAudioSchema = yup.object().shape({
  title: yup.string(),
  description: yup.string(),
  category: yup.string().oneOf(categories),
});

export const CreateNewPlaylistSchema = yup.object().shape({
  title: yup.string().required("Title is required.It cannot be empty!"),
});

export const UpdateOldPlaylistSchema = yup.object().shape({
  title: yup.string(),
  playlistId: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : "";
  }),
  audioId: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : "";
  }),
  visibility: yup.string().oneOf(["public", "private"], "Visibility must be public or private"),
});
