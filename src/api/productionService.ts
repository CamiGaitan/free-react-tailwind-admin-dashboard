import api from "./client";
import {
  ProductionRequest,
  ProductionResponse,
} from "../types/production";

export const produceProduct = async (
  data: ProductionRequest
): Promise<ProductionResponse> => {
  const response = await api.post<ProductionResponse>(
    "production/produce/",
    data
  );
  return response.data;
};