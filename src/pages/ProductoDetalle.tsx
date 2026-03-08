import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Product } from "../types/product";
import { getProducts } from "../api/productService";

export default function ProductoDetalle() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    const products = await getProducts();
    const found = products.find(p => p.id === Number(id));
    if (found) setProduct(found);
  };

  if (!product) return <div>Cargando...</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Tipo: {product.product_type}</p>
      <p>Stock: {product.current_stock}</p>
      <p>Costo último: {product.cost_last_production}</p>
      <p>Precio: {product.price}</p>
    </div>
  );
}