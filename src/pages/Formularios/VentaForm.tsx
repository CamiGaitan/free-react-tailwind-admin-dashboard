import { FormEvent, useEffect, useState } from "react";
import { getProducts } from "../../api/productService";
import { getPaymentMethods } from "../../api/paymentService";
import { createSale, getSaleById, updateSale } from "../../api/salesService";
import { Product } from "../../types/product";
import { PaymentMethod } from "../../types/payment";
import { CreateSaleRequest, SaleItem } from "../../types/sale";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

export default function SaleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [products, setProducts] = useState<Product[]>([]);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);

  const [form, setForm] = useState({
    items: [{ product: 0, quantity: 1 }] as SaleItem[],
    payment_method_id: 0,
  });

  useEffect(() => {
    getProducts().then((res) => setProducts(res));
    getPaymentMethods().then((res) => setMethods(res));
  }, []);

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadSale = async () => {
      const sale = await getSaleById(Number(id));
      const saleWithDetails = sale as unknown as {
        items?: Array<{ product: number; quantity: number }>;
        payment_method?: number;
        payment_method_id?: number;
      };

      const items =
        saleWithDetails.items && saleWithDetails.items.length > 0
          ? saleWithDetails.items.map((item) => ({
              product: Number(item.product) || 0,
              quantity: Number(item.quantity) || 1,
            }))
          : [{ product: 0, quantity: 1 }];

      setForm({
        items,
        payment_method_id:
          saleWithDetails.payment_method ?? saleWithDetails.payment_method_id ?? 0,
      });
    };

    loadSale();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const normalizedItems = form.items
      .filter((item) => item.product > 0 && item.quantity > 0)
      .map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }));

    if (normalizedItems.length === 0) {
      alert("Agregá al menos un producto con cantidad válida");
      return;
    }

    const payload: CreateSaleRequest = {
      items: normalizedItems,
      payment_method: form.payment_method_id,
    };

    if (id) {
      await updateSale(Number(id), payload);
      alert("Venta actualizada");
    } else {
      await createSale(payload);
      alert("Venta creada");
    }

    navigate("/ventas");
  };

  const updateItem = (index: number, field: keyof SaleItem, value: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, rowIndex) =>
        rowIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { product: 0, quantity: 1 }],
    }));
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle={isEditMode ? "Editar venta" : "Crear venta"} />
      <ComponentCard>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <Label>Productos de la venta</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  Agregar producto
                </Button>
              </div>

              {form.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 gap-3 md:grid-cols-12">
                  <div className="md:col-span-7">
                    <select
                      value={item.product || ""}
                      onChange={(e) =>
                        updateItem(index, "product", Number(e.target.value))
                      }
                      className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    >
                      <option value="">Seleccionar producto</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <Input
                      type="number"
                      placeholder="Cantidad"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", Number(e.target.value) || 1)
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => removeItem(index)}
                      disabled={form.items.length === 1}
                    >
                      Quitar
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="payment_method_id">Método de pago</Label>
              <select
                id="payment_method_id"
                value={form.payment_method_id || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    payment_method_id: Number(e.target.value),
                  })
                }
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              >
                <option value="">Seleccionar método</option>
                {methods.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <Button type="submit">{isEditMode ? "Guardar cambios" : "Registrar venta"}</Button>
            </div>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}