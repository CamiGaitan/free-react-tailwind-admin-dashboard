import api from "./client";

export const loginUser = async (username, password) => {
  const response = await api.post("auth/login/", {
    username,
    password,
  });

  const { access, refresh } = response.data;

  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};