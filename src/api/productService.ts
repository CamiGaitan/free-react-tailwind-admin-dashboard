import api from "./client";
import {
  Aroma,
  Product,
  ProductType,
  ProductUpsertPayload,
} from "../types/product";

type BackendProductType = "finished" | "raw_material";

type BackendProduct = {
  id: number;
  name: string;
  product_type: BackendProductType;
  sale_price: string | number;
  cost_price: string | number;
  current_stock: number;
  minimum_stock: number;
  aroma?: number | null;
  aroma_name?: string | null;
  presentation?: string;
  active?: boolean;
};

const toFrontType = (t: BackendProductType): ProductType =>
  t === "raw_material" ? "raw" : "finished";

const toBackType = (t: ProductType): BackendProductType =>
  t === "raw" ? "raw_material" : "finished";

const toFrontProduct = (p: BackendProduct): Product => ({
  id: p.id,
  name: p.name,
  product_type: toFrontType(p.product_type),
  price: Number(p.sale_price ?? 0),
  cost_last_production: Number(p.cost_price ?? 0),
  current_stock: Number(p.current_stock ?? 0),
  min_stock: Number(p.minimum_stock ?? 0),
  aroma_id: p.aroma ?? null,
  aroma_name: p.aroma_name ?? null,
  presentation: (p.presentation as any) ?? "other",
  active: p.active ?? true,
});

const toBackPayload = (payload: ProductUpsertPayload) => {
  const isRaw = payload.product_type === "raw";

  return {
    name: payload.name,
    product_type: toBackType(payload.product_type),
    sale_price: payload.price,
    cost_price: payload.cost_last_production,
    current_stock: payload.current_stock,
    minimum_stock: payload.min_stock,
    active: payload.active ?? true,
    ...(isRaw
      ? { aroma: null, presentation: "other" }
      : {
          aroma: payload.aroma_id ?? null,
          presentation: payload.presentation ?? "other",
        }),
  };
};

export const getProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<BackendProduct[]>("products/");
  return data.map(toFrontProduct);
};

export const getProductById = async (id: number): Promise<Product> => {
  const { data } = await api.get<BackendProduct>(`products/${id}/`);
  return toFrontProduct(data);
};

export const createProduct = async (payload: ProductUpsertPayload): Promise<Product> => {
  const { data } = await api.post<BackendProduct>("products/", toBackPayload(payload));
  return toFrontProduct(data);
};

export const updateProduct = async (
  id: number,
  payload: ProductUpsertPayload
): Promise<Product> => {
  const { data } = await api.patch<BackendProduct>(`products/${id}/`, toBackPayload(payload));
  return toFrontProduct(data);
};

export const getAromas = async (): Promise<Aroma[]> => {
  const { data } = await api.get<Aroma[]>("products/aromas/");
  return data;
};