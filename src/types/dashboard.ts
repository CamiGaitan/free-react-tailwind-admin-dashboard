export interface LatestSale {
  id: number;
  created_at: string;
  total_amount: string | number;
  items_count: number;
  payment_method_name: string | null;
}

export interface ProductSalesRow {
  product_id: number;
  product_name: string;
  quantity_sold: number;
  total_revenue: string | number;
}

export interface Breakeven {
  target: string | number;
  current: string | number;
  remaining: string | number;
  progress_percent: number;
}

export interface DashboardMetrics {
  month: number;
  year: number;
  total_products: number;
  low_stock_products: number;
  monthly_sales_total: string | number;
  monthly_sales_count: number;
  monthly_expenses_total: string | number;
  monthly_margin: string | number;
  breakeven: Breakeven;
  latest_sales: LatestSale[];
  sales_by_product: ProductSalesRow[];
  total_sales: string | number;
  total_expenses: string | number;
  net_profit: string | number;
}