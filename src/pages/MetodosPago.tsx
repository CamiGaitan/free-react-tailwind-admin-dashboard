import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import BasicTableOne from "../components/tables/BasicTables/BasicTableOne";

export default function MetodosPago() {
    return (
        <div>
            <PageMeta
                title="React.js Ventas Dashboard | TailAdmin - React.js Admin Dashboard Template"
                description="This is React.js Ventas  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Métodos de pago y comisiones" />
            <BasicTableOne />
        </div>
    );
}