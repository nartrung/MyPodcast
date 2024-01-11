import * as yup from "yup";

export const CreateUserSchema = yup.object().shape({
  name: yup.string().trim().required("Name is required.It cannot be empty!"),
  email: yup
    .string()
    .required("Email is required.It cannot be empty!")
    .email("Invalid Email!"),
  password: yup
    .string()
    .trim()
    .required("Password is missing!")
    .min(8, "Password is too short!")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password is too simple!"
    ),
});
