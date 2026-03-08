export interface ProductionRequest {
    product_id: number;
    quantity: number;
}

export interface ProductionResponse {
    message: string;
    total_cost: number;
}