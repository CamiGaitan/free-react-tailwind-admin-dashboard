// types/balance.ts
export interface MonthlyBalanceRow {
  month: string; // YYYY-MM
  income: string | number;
  expense: string | number;
  balance: string | number;
  accumulated: string | number;
}

export interface AromaMatrixRow {
  aroma: string;
  values: Record<string, number>;
  row_total: number;
}

export interface AromaSalesTable {
  year: number;
  month: number;
  presentations: string[];
  rows: AromaMatrixRow[];
  totals: {
    by_presentation: Record<string, number>;
    grand_total_units: number;
  };
}

export interface BalanceWithAromaResponse {
  monthly_balance: MonthlyBalanceRow[];
  aroma_sales_table: AromaSalesTable;
}