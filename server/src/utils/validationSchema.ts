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
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      } else {
        return "";
      }
    })
    .required("Invalid User ID"),
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
