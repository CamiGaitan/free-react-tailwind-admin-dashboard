import { FormEvent, useEffect, useState } from "react";
import {
  createPaymentMethod,
  getPaymentMethodById,
  updatePaymentMethod,
} from "../../api/paymentService";
import { useNavigate, useParams } from "react-router-dom";

export default function CrearMetodoDePago() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    commission_percentage: 0,
  });

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadMethod = async () => {
      const method = await getPaymentMethodById(Number(id));
      setForm({
        name: method.name,
        commission_percentage: method.commission_percentage,
      });
    };

    loadMethod();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (id) {
      await updatePaymentMethod(Number(id), form);
      alert("Método actualizado");
    } else {
      await createPaymentMethod(form);
      alert("Método creado");
    }

    navigate("/metodos-pago-comisiones");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Nombre"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="number"
        placeholder="Comisión %"
        value={form.commission_percentage}
        onChange={(e) =>
          setForm({
            ...form,
            commission_percentage: Number(e.target.value) || 0,
          })
        }
      />

      <button type="submit">
        {isEditMode ? "Guardar cambios" : "Crear método de pago"}
      </button>
    </form>
  );
}