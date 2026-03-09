// src/api/dashboardService.ts
import api from "./client";
import { DashboardMetrics } from "../types/dashboard";

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const { data } = await api.get<DashboardMetrics>("dashboard/summary/");
  return data;
};