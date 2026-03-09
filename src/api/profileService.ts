import api from "./client";

export type Me = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
};

export const getMe = async (): Promise<Me> => {
  const response = await api.get<Me>("auth/me/");
  return response.data;
};

export const updateMe = async (
  payload: Partial<Pick<Me, "first_name" | "last_name" | "email">>
): Promise<Me> => {
  const response = await api.patch<Me>("auth/me/", payload);
  return response.data;
};