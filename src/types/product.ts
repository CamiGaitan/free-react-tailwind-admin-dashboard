export type ProductType = "finished" | "raw" | "RAW_MATERIAL";

export interface ProductBomItem {
  raw_material: number;
  quantity: number;
}

export interface Product {
  id: number;
  name: string;
  product_type: ProductType;
  price: number;
  current_stock: number;
  min_stock: number;
  cost_last_production: number;
  bom?: ProductBomItem[];
  recipe?: ProductBomItem[];
}

export interface ProductUpsertPayload extends Omit<Product, "id"> {
  bom?: ProductBomItem[];
}