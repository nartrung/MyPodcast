import axios from "axios";

const URL = "http://localhost:8080/admin/";

export const login = (email: string, password: string) => {
  return axios
    .post(URL + "sign-in", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return response.data;
    });
};

export const logout = () => {
  localStorage.removeItem("token");
};
