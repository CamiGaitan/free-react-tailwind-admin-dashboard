import { FormEvent, useEffect, useState } from "react";
import {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../../api/productService";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Product,
  ProductBomItem,
  ProductType,
  ProductUpsertPayload,
  ProductPresentation,
} from "../../types/product";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";

interface ApiError {
  response?: {
    data?: unknown;
  };
}

export default function ProductForm() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);
  const isInsumoForm = location.pathname.startsWith("/insumos");
  const productType: ProductType = isInsumoForm ? "raw" : "finished";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: 0,
    cost_last_production: 0,
    current_stock: 0,
    product_type: productType,
    min_stock: 0,
  });

  const [rawMaterials, setRawMaterials] = useState<Product[]>([]);
  const [bomItems, setBomItems] = useState<ProductBomItem[]>([
    { raw_material: 0, quantity: 1 },
  ]);

  const [presentation, setPresentation] =
    useState<ProductPresentation>("home_spray");

  const presentationOptions = [
    { value: "home_spray", label: "Home spray" },
    { value: "mini_home", label: "Mini home" },
    { value: "diffuser", label: "Difusor" },
    { value: "mini_diffuser", label: "Mini difusor" },
    { value: "wax_melts", label: "Wax melts" },
    { value: "car_diffuser", label: "Difusor de auto" },
    { value: "other", label: "Otro" },
  ] satisfies Array<{ value: ProductPresentation; label: string }>;

  useEffect(() => {
    setForm((prev) => ({ ...prev, product_type: productType }));
  }, [productType]);

  useEffect(() => {
    const loadRawMaterials = async () => {
      try {
        const products = await getProducts();
        setRawMaterials(products.filter((product) => product.product_type === "raw"));
      } catch (e) {
        console.error(e);
      }
    };

    loadRawMaterials();
  }, []);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const product = await getProductById(Number(id));

        setForm({
          name: product.name,
          price: product.price,
          cost_last_production: product.cost_last_production,
          current_stock: product.current_stock,
          product_type: product.product_type,
          min_stock: product.min_stock,
        });

        if (product.product_type === "finished") {
          setPresentation(product.presentation ?? "home_spray");
        }

        const incomingBom = product.bom ?? [];
        if (Array.isArray(incomingBom) && incomingBom.length > 0) {
          const parsedBom = incomingBom
            .map((item) => ({
              raw_material: Number(item.raw_material ?? 0) || 0,
              quantity: Number(item.quantity) || 1,
            }))
            .filter((item) => item.raw_material > 0);

          if (parsedBom.length > 0) setBomItems(parsedBom);
        }
      } catch (e) {
        console.error(e);
        setError("No se pudo cargar el producto.");
      }
    };

    loadProduct();
  }, [id]);

  const updateBomItem = (
    index: number,
    field: keyof ProductBomItem,
    value: number
  ) => {
    setBomItems((prev) =>
      prev.map((item, rowIndex) =>
        rowIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addBomItem = () => {
    setBomItems((prev) => [...prev, { raw_material: 0, quantity: 1 }]);
  };

  const removeBomItem = (index: number) => {
    setBomItems((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const normalizedBom = bomItems
      .filter((item) => item.raw_material > 0 && item.quantity > 0)
      .map((item) => ({
        raw_material: item.raw_material,
        quantity: item.quantity,
      }));

    const payload: ProductUpsertPayload = {
      name: form.name,
      product_type: productType,
      price: form.price,
      cost_last_production: form.cost_last_production,
      current_stock: form.current_stock,
      min_stock: form.min_stock,
      active: true,
    };

    if (!isInsumoForm) {
      payload.presentation = presentation;
      payload.bom = normalizedBom;
    }

    try {
      setLoading(true);

      if (id) {
        await updateProduct(Number(id), payload);
        alert("Producto actualizado exitosamente");
      } else {
        await createProduct(payload);
        alert(`${isInsumoForm ? "Insumo" : "Producto"} creado exitosamente`);
      }

      navigate(isInsumoForm ? "/insumos" : "/productos");
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error(apiError?.response?.data || err);
      setError(
        apiError?.response?.data
          ? JSON.stringify(apiError.response.data)
          : "No se pudo guardar."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta title="Gestión de productos" description="Alta y edición de productos e insumos" />
      <PageBreadcrumb
        pageTitle={`${isEditMode ? "Editar" : "Crear"} ${isInsumoForm ? "insumo" : "producto"}`}
      />

      <ComponentCard>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder={isInsumoForm ? "Envase de 250 ml" : "Difusor 250"}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {!isInsumoForm && (
              <div>
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="1000"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
            )}

            <div>
              <Label htmlFor="cost_last_production">Último costo</Label>
              <Input
                id="cost_last_production"
                type="number"
                placeholder="700"
                value={form.cost_last_production}
                onChange={(e) =>
                  setForm({ ...form, cost_last_production: parseFloat(e.target.value) || 0 })
                }
              />
            </div>

            <div>
              <Label htmlFor="initial_stock">Stock Inicial</Label>
              <Input
                id="initial_stock"
                type="number"
                placeholder="50"
                value={form.current_stock}
                onChange={(e) =>
                  setForm({ ...form, current_stock: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div>
              <Label htmlFor="min_stock">Stock Mínimo</Label>
              <Input
                id="min_stock"
                type="number"
                placeholder="10"
                value={form.min_stock}
                onChange={(e) => setForm({ ...form, min_stock: parseInt(e.target.value) || 0 })}
              />
            </div>

            {!isInsumoForm && (
              <>
                <div>
                  <Label htmlFor="presentation">Presentación</Label>
                  <Select
                    key={`presentation-${presentation}`}
                    defaultValue={presentation}
                    options={presentationOptions}
                    onChange={(value) => setPresentation(value as ProductPresentation)}
                  />
                </div>

                <div className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <Label>Insumos necesarios</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addBomItem}>
                      Agregar insumo
                    </Button>
                  </div>

                  {bomItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 gap-3 md:grid-cols-12">
                      <div className="md:col-span-7">
                        <Select
                          key={`bom-${index}-${item.raw_material}`}
                          defaultValue={item.raw_material ? String(item.raw_material) : ""}
                          placeholder="Seleccionar insumo"
                          options={rawMaterials.map((material) => ({
                            value: String(material.id),
                            label: material.name,
                          }))}
                          onChange={(value) =>
                            updateBomItem(index, "raw_material", Number(value))
                          }
                        />
                      </div>

                      <div className="md:col-span-3">
                        <Input
                          type="number"
                          placeholder="Cantidad"
                          value={item.quantity}
                          onChange={(e) =>
                            updateBomItem(index, "quantity", Number(e.target.value) || 1)
                          }
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => removeBomItem(index)}
                          disabled={bomItems.length === 1}
                        >
                          Quitar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="mt-4">
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Guardando..."
                  : isEditMode
                  ? "Guardar cambios"
                  : `Crear ${isInsumoForm ? "Insumo" : "Producto"}`}
              </Button>
            </div>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}