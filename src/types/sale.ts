export interface SaleItem {
    product: number;
    quantity: number;
}

export interface Sale {
    id: number;
    total_amount: number;
    created_at: string;
    payment_method_name: string;
    gross_margin: number;
}

export interface CreateSaleRequest {
    items: SaleItem[];
    payment_method: number;
}