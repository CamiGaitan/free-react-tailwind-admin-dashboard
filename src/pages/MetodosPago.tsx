import { useEffect, useState } from "react";
import { getPaymentMethods } from "../api/paymentService";
import { PaymentMethod } from "../types/payment";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import DataTable from "../components/tables/DataTable";
import Button from "../components/ui/button/Button";
import { PlusIcon } from "../icons";
import { useNavigate } from "react-router-dom";

export default function MetodosPago() {

    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        loadPaymentMethods();
    }, []);

    const loadPaymentMethods = async () => {
        const data = await getPaymentMethods();
        setMethods(data);
    };

    const columns = [
        { header: "Nombre", accessor: "name" as const },
        { header: "Comisión (%)", accessor: "commission_percentage" as const },
        { header: "Acciones", cell: (row: PaymentMethod) => (
                <button onClick={() => navigate(`/metodos-pago-comisiones/${row.id}/editar`)} className="text-blue-600 hover:text-blue-800">
                    Editar
                </button>
            ),
         },
    ];

    return (
        <div>
            <PageMeta
                title="React.js Ventas Dashboard | TailAdmin - React.js Admin Dashboard Template"
                description="This is React.js Ventas  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Métodos de pago y comisiones" />
            <Button
                variant="primary"
                className="mb-4"
                startIcon={<PlusIcon />}
                onClick={() => navigate("/metodos-pago-comisiones/nuevo")}
            >
                Crear Método de Pago
            </Button>
            <DataTable columns={columns} data={methods} />
        </div>
    );
}