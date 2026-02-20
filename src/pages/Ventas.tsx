import DataTable from "../components/tables/DataTable";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Button from "../components/ui/button/Button";
import { PlusIcon } from "../icons";

interface Sale {
  id: number;
  date: string;
  total: number;
  payment_method: string;
  gross_margin: number;
}

const salesMock: Sale[] = [
  { id: 1, date: "2025-02-10", total: 1200, payment_method: "Credit Card", gross_margin: 320 },
  { id: 2, date: "2025-02-11", total: 800, payment_method: "Cash", gross_margin: 210 },
];

export default function Ventas() {
  const columns: { header: string; accessor: keyof Sale; render?: (value: any) => React.ReactNode }[] = [
    { header: "ID", accessor: "id" },
    { header: "Fecha", accessor: "date" },
    { header: "Método de pago", accessor: "payment_method" },
    { header: "Total", accessor: "total" },
    { header: "Margen bruto", accessor: "gross_margin" },
    { header: "Acciones", accessor: "id", render: (value) => (
      <Button variant="outline" size="sm">
        Ver detalles
      </Button>
    ) },
  ];

  return (
    <>
      <PageBreadcrumb pageTitle="Ventas" />
      <Button variant="primary" className="mb-4" startIcon={<PlusIcon />}>Agregar</Button>
      <DataTable columns={columns} data={salesMock} />
    </>
  );
}