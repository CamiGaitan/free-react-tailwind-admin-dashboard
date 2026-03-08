import api from "./client";
import { DashboardMetrics } from "../types/dashboard";

export const getDashboardMetrics = () =>
    api.get<DashboardMetrics>("dashboard/");