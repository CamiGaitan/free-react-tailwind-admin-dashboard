import api from "./client";
import { AuthResponse } from "../types/auth";

export const loginUser = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("token/", {
    username,
    password,
  });

  const { access, refresh } = response.data;

  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);

  return response.data;
};

export const logoutUser = (): void => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};
