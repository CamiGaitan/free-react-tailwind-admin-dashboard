import { FormEvent, useEffect, useMemo, useState } from "react";
import { getProducts, getAromas } from "../../api/productService";
import { getPaymentMethods } from "../../api/paymentService";
import { createSale, getSaleById, updateSale } from "../../api/salesService";
import { CreateSaleRequest } from "../../types/sale";
import { Product, Aroma } from "../../types/product";
import { PaymentMethod } from "../../types/payment";
import { useNavigate, useParams } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";

type SaleFormItem = {
  product_name: string;
  aroma_name: string;
  quantity: number;
};

type CreateSaleItemRequest = {
  product: number;
  quantity: number;
  aroma_name: string;
};

type CreateSaleRequestWithAroma = {
  items: CreateSaleItemRequest[];
  payment_method: number;
};

export default function SaleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [products, setProducts] = useState<Product[]>([]);
  const [aromas, setAromas] = useState<Aroma[]>([]);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    items: [{ product_name: "", aroma_name: "", quantity: 1 }] as SaleFormItem[],
    payment_method_id: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, aromasRes, methodsRes] = await Promise.all([
          getProducts(),
          getAromas(),
          getPaymentMethods(),
        ]);

        setProducts(productsRes.filter((p) => p.product_type === "finished"));
        setAromas(aromasRes);
        setMethods(methodsRes);
      } catch {
        setError("No se pudieron cargar productos, aromas o métodos de pago.");
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!id) return;

    const loadSale = async () => {
      try {
        const sale = await getSaleById(Number(id));
        const saleWithDetails = sale as unknown as {
          items?: Array<{
            quantity?: number;
            product_name_snapshot?: string;
            product_aroma_name_snapshot?: string;
          }>;
          payment_method?: number;
          payment_method_id?: number;
        };

        const items =
          saleWithDetails.items && saleWithDetails.items.length > 0
            ? saleWithDetails.items.map((item) => ({
                product_name: item.product_name_snapshot || "",
                aroma_name: item.product_aroma_name_snapshot || "",
                quantity: Number(item.quantity) || 1,
              }))
            : [{ product_name: "", aroma_name: "", quantity: 1 }];

        setForm({
          items,
          payment_method_id:
            saleWithDetails.payment_method ?? saleWithDetails.payment_method_id ?? 0,
        });
      } catch {
        setError("No se pudo cargar la venta.");
      }
    };

    loadSale();
  }, [id]);

  const productNameOptions = useMemo(() => {
    const uniqueNames = Array.from(
      new Set(products.map((p) => (p.name || "").trim()).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));

    return uniqueNames.map((name) => ({ value: name, label: name }));
  }, [products]);

  const aromaOptions = useMemo(
    () =>
      aromas
        .filter((a) => a.active)
        .map((a) => ({ value: a.name, label: a.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [aromas]
  );

  const paymentOptions = useMemo(
    () => methods.map((m) => ({ value: String(m.id), label: m.name })),
    [methods]
  );

  const findBaseProduct = (item: SaleFormItem) =>
    products.find(
      (p) =>
        p.product_type === "finished" &&
        (p.name || "").trim().toLowerCase() === item.product_name.trim().toLowerCase()
    );

  const updateItem = (index: number, patch: Partial<SaleFormItem>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, rowIndex) =>
        rowIndex === index ? { ...item, ...patch } : item
      ),
    }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { product_name: "", aroma_name: "", quantity: 1 }],
    }));
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  const itemSubtotal = (item: SaleFormItem) =>
    (findBaseProduct(item)?.price || 0) * (item.quantity || 0);

  const estimatedTotal = useMemo(
    () => form.items.reduce((acc, item) => acc + itemSubtotal(item), 0),
    [form.items, products]
  );

  const money = (n: number) =>
    n.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.payment_method_id) {
      setError("Seleccioná un método de pago.");
      return;
    }

    const normalizedItems = form.items
      .map((item) => ({
        productObj: findBaseProduct(item),
        quantity: Number(item.quantity) || 0,
        aroma_name: item.aroma_name.trim(),
      }))
      .filter((row) => row.productObj && row.quantity > 0 && row.aroma_name)
      .map((row) => ({
        product: row.productObj!.id,
        quantity: row.quantity,
        aroma_name: row.aroma_name,
      }));

    if (normalizedItems.length === 0) {
      setError("Agregá al menos un ítem válido (producto + aroma + cantidad).");
      return;
    }

    const payload: CreateSaleRequestWithAroma = {
      items: normalizedItems,
      payment_method: form.payment_method_id,
    };

    try {
      setLoading(true);

      if (isEditMode) {
        await updateSale(Number(id), payload as unknown as CreateSaleRequest);
        alert("Venta actualizada");
      } else {
        await createSale(payload as unknown as CreateSaleRequest);
        alert("Venta creada");
      }

      navigate("/ventas");
    } catch (err: any) {
      setError(
        err?.response?.data
          ? JSON.stringify(err.response.data)
          : "No se pudo registrar la venta."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta
        title="Crear venta"
        description="Registro de ventas por producto base, aroma y cantidad"
      />
      <PageBreadcrumb pageTitle={isEditMode ? "Editar venta" : "Crear venta"} />

      <ComponentCard>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <Label>Productos de la venta</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  Agregar producto
                </Button>
              </div>

              {form.items.map((item, index) => {
                const selectedProduct = findBaseProduct(item);
                const unitPrice = selectedProduct?.price || 0;
                const subtotal = itemSubtotal(item);

                return (
                  <div key={index} className="grid grid-cols-1 gap-3 md:grid-cols-12">
                    <div className="md:col-span-4">
                      <Label>Producto</Label>
                      <Select
                        key={`product-${index}-${item.product_name}`}
                        defaultValue={item.product_name}
                        placeholder="Seleccionar producto"
                        options={productNameOptions}
                        onChange={(value) => updateItem(index, { product_name: value })}
                      />
                    </div>

                    <div className="md:col-span-3">
                      <Label>Aroma</Label>
                      <Select
                        key={`aroma-${index}-${item.aroma_name}`}
                        defaultValue={item.aroma_name}
                        placeholder="Seleccionar aroma"
                        options={aromaOptions}
                        onChange={(value) => updateItem(index, { aroma_name: value })}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        placeholder="Cantidad"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, { quantity: Number(e.target.value) || 1 })
                        }
                      />
                    </div>

                    <div className="md:col-span-2 flex items-end text-sm text-gray-600 dark:text-gray-300">
                      {money(unitPrice)} c/u
                    </div>

                    <div className="md:col-span-1 flex items-end">
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

                    <div className="md:col-span-12 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subtotal: {money(subtotal)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total estimado</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {money(estimatedTotal)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                El total, costo y margen final se calculan en backend.
              </p>
            </div>

            <div>
              <Label>Método de pago</Label>
              <Select
                key={`payment-${form.payment_method_id}`}
                defaultValue={form.payment_method_id ? String(form.payment_method_id) : ""}
                placeholder="Seleccionar método"
                options={paymentOptions}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    payment_method_id: Number(value) || 0,
                  }))
                }
              />
            </div>

            <div className="mt-4">
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Guardando..."
                  : isEditMode
                  ? "Guardar cambios"
                  : "Registrar venta"}
              </Button>
            </div>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}