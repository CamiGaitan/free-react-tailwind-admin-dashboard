import { useState, useEffect } from "react";
import { getProducts } from "../api/productService";
import { Product } from "../types/product";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import DataTable from "../components/tables/DataTable";
import Button from "../components/ui/button/Button";
import { PlusIcon } from "../icons";
import { useNavigate } from "react-router-dom";

export default function Insumos() {

  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data.filter(p => p.product_type === "raw"));
  };
  
  const columns = [
    { header: "Nombre", accessor: "name" as const },
    { header: "Precio", accessor: "price" as const },
    { header: "Costo", accessor: "cost_last_production" as const },
    { header: "Stock", accessor: "current_stock" as const },
    { header: "Acciones",
      accessor: "id" as const,
      render: (_value: number, row: Product) => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/insumos/${row.id}/editar`)}
          >
          Editar
        </Button>
    ) },
  ];

  return (
    <>
      <PageBreadcrumb pageTitle="Insumos" />
      <Button 
        variant="primary" 
        className="mb-4"
        startIcon={<PlusIcon />}
        onClick={() => navigate("/insumos/nuevo")}
        >
          Crear Insumo
      </Button>
      <DataTable columns={columns} data={products} />
    </>
  );
}