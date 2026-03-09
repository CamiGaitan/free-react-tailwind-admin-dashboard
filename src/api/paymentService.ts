// paymentService.ts
import api from "./client";
import { PaymentMethod } from "../types/payment";

const BASE = "sales/payment-methods/";

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const { data } = await api.get<PaymentMethod[]>(BASE);
  return data;
};

export const getPaymentMethodById = async (id: number): Promise<PaymentMethod> => {
  const { data } = await api.get<PaymentMethod>(`${BASE}${id}/`);
  return data;
};

export const createPaymentMethod = async (
  payload: Omit<PaymentMethod, "id">
): Promise<PaymentMethod> => {
  const { data } = await api.post<PaymentMethod>(BASE, payload);
  return data;
};

export const updatePaymentMethod = async (
  id: number,
  payload: Partial<Omit<PaymentMethod, "id">>
): Promise<PaymentMethod> => {
  const { data } = await api.patch<PaymentMethod>(`${BASE}${id}/`, payload);
  return data;
};

export const deletePaymentMethod = async (id: number): Promise<void> => {
  await api.delete(`${BASE}${id}/`);
};