import { useEffect, useState } from "react";
import { getSales } from "../api/salesService";
import { Sale } from "../types/sale";
import DataTable from "../components/tables/DataTable";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Button from "../components/ui/button/Button";
import { PlusIcon } from "../icons";
import { useNavigate } from "react-router-dom";

export default function Finanzas() {

  const [sales, setSales] = useState<Sale[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    const data = await getSales();
    setSales(data);
  };

  const columns: { header: string; accessor: keyof Sale; render?: (value: any) => React.ReactNode }[] = [
    { header: "ID", accessor: "id" as const },
    { header: "Fecha", accessor: "created_at" as const },
    { header: "Concepto", accessor: "payment_method_name" as const },
    { header: "Total", accessor: "total_amount" as const },
    {
      header: "Acciones",
      accessor: "id" as const,
      render: (value: number) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/ventas/${value}/editar`)}
        >
          Editar
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageBreadcrumb pageTitle="Finanzas" />
      <Button
        variant="primary"
        className="mb-4"
        startIcon={<PlusIcon />}
        onClick={() => navigate("/finanzas/nuevo")}
      >
        Agregar gasto
      </Button>
      <DataTable columns={columns} data={sales} />
    </>
  );
}