import api from "./client";
import { PaymentMethod } from "../types/payment";

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const response = await api.get<PaymentMethod[]>("metodos-pago-comisiones/");
  return response.data;
};

export const getPaymentMethodById = async (
  id: number
): Promise<PaymentMethod> => {
  const response = await api.get<PaymentMethod>(`metodos-pago-comisiones/${id}/`);
  return response.data;
};

export const createPaymentMethod = async (
  data: Omit<PaymentMethod, "id">
): Promise<PaymentMethod> => {
  const response = await api.post<PaymentMethod>(
    "metodos-pago-comisiones/",
    data
  );
  return response.data;
};

export const updatePaymentMethod = (
  id: number,
  data: Omit<PaymentMethod, "id">
) => api.put<PaymentMethod>(`metodos-pago-comisiones/${id}/`, data);

export const deletePaymentMethod = (id: number) =>
  api.delete(`metodos-pago-comisiones/${id}/`);