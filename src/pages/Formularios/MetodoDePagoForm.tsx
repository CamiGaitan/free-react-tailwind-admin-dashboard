// MetodoDePagoForm.tsx
import { FormEvent, useEffect, useState } from "react";
import {
  createPaymentMethod,
  getPaymentMethodById,
  updatePaymentMethod,
} from "../../api/paymentService";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

export default function CrearMetodoDePago() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    commission_percentage: 0,
  });

  useEffect(() => {
    if (!id) return;

    const loadMethod = async () => {
      try {
        const method = await getPaymentMethodById(Number(id));
        setForm({
          name: method.name,
          commission_percentage: Number(method.commission_percentage)
        });
      } catch (e) {
        setError("No se pudo cargar el método de pago.");
      }
    };

    loadMethod();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    if (form.commission_percentage < 0) {
      setError("La comisión no puede ser negativa.");
      return;
    }

    try {
      setLoading(true);

      if (id) {
        await updatePaymentMethod(Number(id), form);
        alert("Método actualizado");
      } else {
        await createPaymentMethod(form);
        alert("Método creado");
      }

      navigate("/metodos-pago-comisiones");
    } catch (err: any) {
      setError(
        err?.response?.data
          ? JSON.stringify(err.response.data)
          : "No se pudo guardar el método de pago."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta
        title="Crear Método de Pago"
        description="Formulario para crear un nuevo método de pago"
      />
      <PageBreadcrumb pageTitle={isEditMode ? "Editar Método de Pago" : "Crear Método de Pago"} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <Label>Nombre</Label>
            <Input
              placeholder="Mercado Pago"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <Label>Comisión %</Label>
            <Input
              type="number"
              placeholder="6.5"
              value={form.commission_percentage}
              onChange={(e) =>
                setForm({
                  ...form,
                  commission_percentage: Number(e.target.value),
                })
              }
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading
              ? "Guardando..."
              : isEditMode
              ? "Guardar cambios"
              : "Crear método de pago"}
          </Button>
        </div>
      </form>
    </div>
  );
}