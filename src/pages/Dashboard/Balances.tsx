// pages/Balance/Balance.tsx
import { useEffect, useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import DataTable from "../../components/tables/DataTable";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import { getBalanceWithAroma } from "../../api/balanceService";
import { BalanceWithAromaResponse } from "../../types/balances";

const presentationLabels: Record<string, string> = {
  home_spray: "Home spray",
  mini_home: "Mini home",
  diffuser: "Difusor",
  mini_diffuser: "Mini difusor",
  wax_melts: "Wax melts",
  car_diffuser: "Difusor de auto",
  other: "Otros",
};

export default function BalancePage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [openDropdown, setOpenDropdown] = useState<"year" | "month" | null>(null);

  const [data, setData] = useState<BalanceWithAromaResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const formatMoney = (value: string | number) =>
    Number(value || 0).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });

  const load = async () => {
    try {
      setLoading(true);
      const res = await getBalanceWithAroma(year, month);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [year, month]);

  const balanceColumns = useMemo(
    () => [
      { header: "Mes", accessor: "month" as const },
      { header: "Ingresos", accessor: "income" as const, render: (v: string | number) => formatMoney(v) },
      { header: "Egresos", accessor: "expense" as const, render: (v: string | number) => formatMoney(v) },
      { header: "Balance", accessor: "balance" as const, render: (v: string | number) => formatMoney(v) },
      { header: "Acumulado", accessor: "accumulated" as const, render: (v: string | number) => formatMoney(v) },
    ],
    []
  );

  const aromaColumns = useMemo(() => {
    const presentations = data?.aroma_sales_table.presentations || [];
    return [
      { header: "Aroma", accessor: "aroma" as const },
      ...presentations.map((key) => ({
        header: presentationLabels[key] || key,
        cell: (row: { values: Record<string, number> }) => row.values[key] ?? 0,
      })),
      { header: "TOTAL", accessor: "row_total" as const },
    ];
  }, [data]);

  const aromaRowsWithTotal = useMemo(() => {
    if (!data) return [];
    const rows = data.aroma_sales_table.rows;
    const totals = data.aroma_sales_table.totals.by_presentation;

    return [
      ...rows,
      {
        aroma: "TOTAL",
        values: totals,
        row_total: data.aroma_sales_table.totals.grand_total_units,
      },
    ];
  }, [data]);

  const years = useMemo(() => {
    const currentYear = now.getFullYear();
    return Array.from({ length: 5  }, (_, index) => currentYear + 3 - index);
  }, [now]);

  const months = useMemo(
    () => [
      { value: 1, label: "Enero" },
      { value: 2, label: "Febrero" },
      { value: 3, label: "Marzo" },
      { value: 4, label: "Abril" },
      { value: 5, label: "Mayo" },
      { value: 6, label: "Junio" },
      { value: 7, label: "Julio" },
      { value: 8, label: "Agosto" },
      { value: 9, label: "Septiembre" },
      { value: 10, label: "Octubre" },
      { value: 11, label: "Noviembre" },
      { value: 12, label: "Diciembre" },
    ],
    []
  );

  const selectedMonthLabel = months.find((item) => item.value === month)?.label ?? "Seleccionar";

  return (
    <>
      <PageMeta title="Balance" description="Balance mensual y matriz de ventas por aroma" />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-wrap items-end gap-3">
            <div className="relative">
              <label className="mb-1 block text-sm text-gray-500">Año</label>
              <button
                type="button"
                className="dropdown-toggle min-w-[140px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                onClick={() => setOpenDropdown((prev) => (prev === "year" ? null : "year"))}
              >
                {year}
              </button>

              <Dropdown
                isOpen={openDropdown === "year"}
                onClose={() => setOpenDropdown(null)}
                className="w-full overflow-hidden p-1"
              >
                <ul className="max-h-56 overflow-y-auto">
                  {years.map((yearOption) => (
                    <li key={yearOption}>
                      <button
                        type="button"
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                        onClick={() => {
                          setYear(yearOption);
                          setOpenDropdown(null);
                        }}
                      >
                        {yearOption}
                      </button>
                    </li>
                  ))}
                </ul>
              </Dropdown>
            </div>

            <div className="relative">
              <label className="mb-1 block text-sm text-gray-500">Mes</label>
              <button
                type="button"
                className="dropdown-toggle min-w-[180px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                onClick={() => setOpenDropdown((prev) => (prev === "month" ? null : "month"))}
              >
                {selectedMonthLabel}
              </button>

              <Dropdown
                isOpen={openDropdown === "month"}
                onClose={() => setOpenDropdown(null)}
                className="w-full overflow-hidden p-1"
              >
                <ul className="max-h-56 overflow-y-auto">
                  {months.map((monthOption) => (
                    <li key={monthOption.value}>
                      <button
                        type="button"
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                        onClick={() => {
                          setMonth(monthOption.value);
                          setOpenDropdown(null);
                        }}
                      >
                        {monthOption.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </Dropdown>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-12">
          <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">Balance mensual</h3>
          {loading ? <p className="text-sm text-gray-500">Cargando...</p> : <DataTable columns={balanceColumns} data={data?.monthly_balance || []} />}
        </div>

        <div className="col-span-12 xl:col-span-12">
          <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">Ventas por aroma y presentación</h3>
          {loading ? <p className="text-sm text-gray-500">Cargando...</p> : <DataTable columns={aromaColumns as any} data={aromaRowsWithTotal} />}
        </div>
      </div>
    </>
  );
}