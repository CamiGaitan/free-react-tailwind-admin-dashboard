import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createExpense,
  ExpenseCategory,
  getRawMaterials,
  purchaseRawMaterial,
} from "../../api/financeService";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";

type ExpenseKind = "supplies" | "other";

export default function ExpenseForm() {
  const [rawMaterials, setRawMaterials] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    amount: 0,
    description: "",
    kind: "other" as ExpenseKind,
    category: "Other" as ExpenseCategory,
    raw_material_id: 0,
    quantity: 1,
  });

  useEffect(() => {
    getRawMaterials().then(setRawMaterials);
  }, []);

  const kindOptions = useMemo(
    () => [
      { value: "Other", label: "Otros gastos" },
      { value: "Supplies", label: "Compra de insumos" },
    ],
    []
  );

  const categoryOptions = useMemo(
    () => [
      { value: "Other", label: "Otros" },
      { value: "Rent", label: "Alquiler" },
      { value: "Marketing", label: "Marketing" },
      { value: "Utilities", label: "Servicios" },
    ],
    []
  );

  const rawMaterialOptions = useMemo(
    () => rawMaterials.map((material) => ({ value: String(material.id), label: material.name })),
    [rawMaterials]
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (form.amount <= 0) {
      alert("Ingresá un monto válido.");
      return;
    }

    setLoading(true);

    try {
      const expenseCategory: ExpenseCategory =
        form.kind === "supplies" ? "supplies" : form.category;

      const expense = await createExpense({
        date: form.date,
        amount: form.amount,
        category: expenseCategory,
        description: form.description,
      });

      if (form.kind === "supplies") {
        if (!form.raw_material_id || form.quantity <= 0) {
          alert("Seleccioná insumo y cantidad válida.");
          setLoading(false);
          return;
        }

        await purchaseRawMaterial(form.raw_material_id, {
          quantity: form.quantity,
          expense_id: expense.id,
        });
      }

      alert("Gasto registrado correctamente");

      setForm({
        date: new Date().toISOString().slice(0, 10),
        amount: 0,
        description: "",
        kind: "other",
        category: "Other",
        raw_material_id: 0,
        quantity: 1,
      });
    } catch (error) {
      alert("Error al registrar gasto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <PageMeta
                title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
                description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
        />
        <PageBreadcrumb pageTitle="Registrar gasto" />
      <ComponentCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div>
              <Label>Fecha del gasto</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div>
              <Label>Monto total</Label>
              <Input
                type="number"
                min="0"
                step={1}
                placeholder="Total gastado"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label>Tipo de gasto</Label>
              <Select
                key={`kind-${form.kind}`}
                defaultValue={form.kind}
                options={kindOptions}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    kind: value as ExpenseKind,
                    category: value === "supplies" ? "supplies" : "Other",
                    raw_material_id: value === "supplies" ? prev.raw_material_id : 0,
                    quantity: value === "supplies" ? prev.quantity : 1,
                  }))
                }
              />
            </div>

            {form.kind === "other" && (
              <div>
                <Label>Categoría</Label>
                <Select
                  key={`category-${form.category}`}
                  defaultValue={form.category}
                  options={categoryOptions}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, category: value as ExpenseCategory }))
                  }
                />
              </div>
            )}

            {form.kind === "supplies" && (
              <>
                <div>
                  <Label>Insumo</Label>
                  <Select
                    key={`raw-material-${form.raw_material_id}`}
                    defaultValue={form.raw_material_id ? String(form.raw_material_id) : ""}
                    placeholder="Seleccionar insumo"
                    options={rawMaterialOptions}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, raw_material_id: Number(value) || 0 }))
                    }
                  />
                </div>

                <div>
                  <Label>Cantidad comprada</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Cantidad comprada"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) || 1 })}
                  />
                </div>
              </>
            )}

            <div>
              <Label>Descripción</Label>
              <Input
                type="text"
                placeholder="Detalle del gasto"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Registrar gasto"}
              </Button>
            </div>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}