import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { getDashboardMetrics } from "../../api/dashboardService";
import { DashboardMetrics } from "../../types/dashboard";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import DataTable from "../../components/tables/DataTable";

export default function Home() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatMoney = (value: string | number) =>
    Number(value || 0).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });

  const latestSalesColumns = useMemo(
    () => [
      { header: "Venta #", accessor: "id" as const },
      {
        header: "Fecha",
        accessor: "created_at" as const,
        render: (v: string) => new Date(v).toLocaleDateString("es-AR"),
      },
      { header: "Ítems", accessor: "items_count" as const },
      {
        header: "Método pago",
        accessor: "payment_method_name" as const,
        render: (v: string | null) => v || "-",
      },
      {
        header: "Total",
        accessor: "total_amount" as const,
        render: (v: string | number) => formatMoney(v),
      },
    ],
    []
  );

  const salesByProductColumns = useMemo(
    () => [
      { header: "Producto", accessor: "product_name" as const },
      { header: "Cantidad vendida", accessor: "quantity_sold" as const },
      {
        header: "Total vendido",
        accessor: "total_revenue" as const,
        render: (v: string | number) => formatMoney(v),
      },
    ],
    []
  );

  if (loading) {
    return <p className="text-sm text-gray-500">Cargando dashboard...</p>;
  }

  return (
    <>
      <PageMeta
        title="Panel de control"
        description="Este es el panel de control del sistema de gestión de inventarios y ventas para tu negocio"
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics
            totalProducts={metrics?.total_products || 0}
            lowStockProducts={metrics?.low_stock_products || 0}
            monthlySalesTotal={Number(metrics?.monthly_sales_total || 0)}
            monthlySalesCount={metrics?.monthly_sales_count || 0}
          />

          <div className="grid grid-cols-2 gap-4 md:gap-6 sm:grid-cols-2">
            <Link to="/sales" className="w-full">
              <Button variant="primary" className="w-full">Ver ventas</Button>
            </Link>
            <Link to="/products" className="w-full">
              <Button variant="outline" className="w-full">Ver productos</Button>
            </Link>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget
            target={Number(metrics?.breakeven?.target || 0)}
            current={Number(metrics?.breakeven?.current || 0)}
            remaining={Number(metrics?.breakeven?.remaining || 0)}
            progressPercent={Number(metrics?.breakeven?.progress_percent || 0)}
          />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <DataTable
            columns={latestSalesColumns}
            data={metrics?.latest_sales || []}
          />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <DataTable
            columns={salesByProductColumns}
            data={metrics?.sales_by_product || []}
          />
        </div>
      </div>
    </>
  );
}