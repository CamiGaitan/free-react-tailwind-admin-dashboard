import api from "./client";
import {
  Sale,
  CreateSaleRequest,
} from "../types/sale";

export const getSales = async (): Promise<Sale[]> => {
  const response = await api.get<Sale[]>("sales/");
  return response.data;
};

export const getSaleById = async (id: number): Promise<Sale> => {
  const response = await api.get<Sale>(`sales/${id}/`);
  return response.data;
};

export const createSale = async (
  data: CreateSaleRequest
): Promise<Sale> => {
  const response = await api.post<Sale>("sales/", data);
  return response.data;
};

export const updateSale = async (
  id: number,
  data: CreateSaleRequest
): Promise<Sale> => {
  const response = await api.put<Sale>(`sales/${id}/`, data);
  return response.data;
};