// api/balanceService.ts
import api from "./client";
import { BalanceWithAromaResponse } from "../types/balances";

export const getBalanceWithAroma = async (
  year?: number,
  month?: number
): Promise<BalanceWithAromaResponse> => {
  const params: Record<string, number> = {};
  if (year) params.year = year;
  if (month) params.month = month;

  const response = await api.get<BalanceWithAromaResponse>("dashboard/balance/", { params });
  return response.data;
};