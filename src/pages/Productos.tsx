import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import DataTable from "../components/tables/DataTable";
import Button from "../components/ui/button/Button";
import { PlusIcon } from "../icons";
import { render } from "@fullcalendar/core/preact.js";

interface Product {
    id: number;
    name: string;
    cost: number;
    price: number;
    stock: number;
    min_stock: number;
      acciones?: null;
    }

const productsMock: Product[] = [
    { id: 1, name: "Producto 1", cost: 10, price: 15, stock: 100, min_stock: 20 },
      { id: 2, name: "Producto 2", cost: 20, price: 30, stock: 50, min_stock: 10, acciones: null },
      { id: 3, name: "Producto 3", cost: 5, price: 8, stock: 200, min_stock: 50, acciones: null },
];

export default function Productos() {
  const columns = [
    { header: "Nombre", accessor: "name" as const },
    { header: "Costo", accessor: "cost" as const },
    { header: "Precio", accessor: "price" as const },
    { header: "Stock", accessor: "stock" as const },
    { header: "Stock mínimo", accessor: "min_stock" as const },
      { header: "Acciones", accessor: "acciones" as const, render: (value: any, row: Product) => (
      <Button variant="outline" size="sm">
        Ver detalles
      </Button>
    ) },
  ];

  return (
    <>
      <PageBreadcrumb pageTitle="Productos" />
      <Button variant="primary" className="mb-4" startIcon={<PlusIcon />}>Agregar</Button>
      <DataTable columns={columns} data={productsMock} />
    </>
  );
}