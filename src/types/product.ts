export type ProductType = "raw" | "finished";

export type ProductPresentation =
  | "home_spray"
  | "mini_home"
  | "diffuser"
  | "mini_diffuser"
  | "wax_melts"
  | "car_diffuser"
  | "other";

export interface ProductBomItem {
  raw_material: number;
  quantity: number;
}

export interface Product {
  id: number;
  name: string;
  product_type: ProductType; // front: raw/finished
  price: number;
  cost_last_production: number;
  current_stock: number;
  min_stock: number;
  aroma_id?: number | null;
  aroma_name?: string | null;
  presentation?: ProductPresentation;
  active?: boolean;
  bom?: ProductBomItem[];
}

export interface ProductUpsertPayload {
  name: string;
  product_type: ProductType;
  price: number;
  cost_last_production: number;
  current_stock: number;
  min_stock: number;
  aroma_id?: number | null;
  presentation?: ProductPresentation;
  bom?: ProductBomItem[];
  active?: boolean;
}

export interface Aroma {
  id: number;
  name: string;
  active: boolean;
}