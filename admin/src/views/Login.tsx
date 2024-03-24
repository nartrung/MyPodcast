import { TextField, Button, Container } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import logo from "../assets/MyPodcastBanner.png";
import { FC, useState } from "react";
import { login } from "../services/auth";
import { Navigate, useNavigate } from "react-router-dom";

const logInValidationSchema = yup.object({
  email: yup
    .string()
    .trim("Vui lòng nhập Email của bạn")
    .email("Email không hợp lệ")
    .required("Vui lòng nhập Email của bạn"),
  password: yup
    .string()
    .trim("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Mật khẩu phải gồm 1 số, 1 ký tự thường và 1 ký tự đặc biệt"
    )
    .required("Vui lòng nhập mật khẩu"),
});

const initialValues = {
  email: "",
  password: "",
};

type AdminLogin = {
  email: string;
  password: string;
};

const Login: FC = () => {
  const token = localStorage.getItem("token");
  let navigate = useNavigate();
  if (token) {
    return <Navigate to="/" />;
  }
  const [err, setErr] = useState("");
  const handleSubmit = async (values: AdminLogin) => {
    login(values.email, values.password)
      .then(() => {
        navigate("/");
        window.location.reload();
      })
      .catch(() => {
        setErr("Email hoặc mật khẩu không đúng");
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Container maxWidth="xs" className="w-96 text-center">
        <img src={logo} />
        <h3 className="text-[#ffa835] font-bold">Vui lòng đăng nhập để tiếp tục</h3>
      </Container>
      <Formik initialValues={initialValues} validationSchema={logInValidationSchema} onSubmit={handleSubmit}>
        {({ errors, touched }) => (
          <Form>
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              name="email"
              label="Email"
              variant="standard"
              error={(errors.email && touched.email) || err !== ""}
              helperText={<ErrorMessage name="email" />}
            />
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              variant="standard"
              name="password"
              label="Mật khẩu"
              type="password"
              error={(errors.password && touched.password) || err !== ""}
              helperText={<ErrorMessage name="password" />}
            />
            {err !== "" ? <h3 className="text-red-600">Email hoặc mật khẩu không đúng</h3> : null}
            <div className="w-100 mt-6 flex justify-center">
              <Button type="submit" variant="contained" sx={{ backgroundColor: "#ffa835" }} className="">
                Đăng nhập
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Login;
