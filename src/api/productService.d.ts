export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export function getProducts(): Promise<Product[]>;