import { useEffect, useState } from "react";
import { getProducts } from "../../api/productService";
import { getDashboardMetrics } from "../../api/dashboardService";
import { DashboardMetrics } from "../../types/dashboard";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    getDashboardMetrics().then((res) => setMetrics(res.data));
  }, []);
  
  return (
    <>
      <PageMeta
        title="Panel de control"
        description="Este es el panel de control del sistema de gestión de inventarios y ventas para tu negocio"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics 
            totalProducts = {metrics?.total_products || 0}
            lowStockProducts = {metrics?.low_stock_products || 0}
            monthlySalesTotal = {metrics?.monthly_sales_total || 0}
            monthlySalesCount = {metrics?.monthly_sales_count || 0}
          />
          <div className="grid grid-cols-2 gap-4 md:gap-6 sm:grid-cols-2">
            <Button variant="primary" className="w-full">
              Ver ventas
            </Button>
            <Button variant="outline" className="w-full">
              Ver productos
            </Button>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <BasicTableOne />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <BasicTableOne />
        </div>
      </div>
    </>
  );
}
