import api from "./client";

export type ExpenseCategory = "supplies" | "Rent" | "Marketing" | "Utilities" | "Other";

export interface CreateExpensePayload {
  date: string; // YYYY-MM-DD
  category: ExpenseCategory;
  amount: number;
  description?: string;
}

export interface Expense {
  id: number;
  date: string;
  category: ExpenseCategory;
  amount: string | number;
  description?: string;
  created_by?: number | null;
  created_at?: string;
}

export const createExpense = async (payload: CreateExpensePayload): Promise<Expense> => {
  const { data } = await api.post<Expense>("finance/expenses/", payload);
  return data;
};

export const purchaseRawMaterial = async (
  rawMaterialId: number,
  payload: { quantity: number; expense_id?: number }
) => {
  const { data } = await api.post(
    `inventory/raw-materials/${rawMaterialId}/purchase/`,
    payload
  );
  return data;
};

export const getRawMaterials = async () => {
  const { data } = await api.get("inventory/raw-materials/");
  return data as Array<{ id: number; name: string; current_stock: number }>;
};