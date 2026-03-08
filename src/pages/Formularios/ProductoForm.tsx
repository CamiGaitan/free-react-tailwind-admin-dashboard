import { FormEvent, useEffect, useState } from "react";
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
} from "../../api/productService";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Product, ProductBomItem, ProductType, ProductUpsertPayload } from "../../types/product";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

export default function ProductForm() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const isInsumoForm = location.pathname.startsWith("/insumos");
    const productType: ProductType = isInsumoForm ? "raw" : "finished";

    const [form, setForm] = useState({
        name: "",
        price: 0,
        cost_last_production: 0,
        current_stock: 0,
        product_type: productType,
        min_stock: 0,
    });
    const [rawMaterials, setRawMaterials] = useState<Product[]>([]);
    const [bomItems, setBomItems] = useState<ProductBomItem[]>([{ raw_material: 0, quantity: 1 }]);

    useEffect(() => {
        setForm((prev) => ({ ...prev, product_type: productType }));
    }, [productType]);

    useEffect(() => {
        const loadRawMaterials = async () => {
            const products = await getProducts();
            setRawMaterials(
                products.filter(
                    (product) =>
                        product.product_type === "RAW_MATERIAL" || product.product_type === "raw"
                )
            );
        };

        loadRawMaterials();
    }, []);

    useEffect(() => {
        if (!id) {
            return;
        }

        const loadProduct = async () => {
            const product = await getProductById(Number(id));
            const normalizedProductType: ProductType = 
                product.product_type === "RAW_MATERIAL" ? "raw" : "finished";
            setForm({
                name: product.name,
                price: product.price,
                cost_last_production: product.cost_last_production,
                current_stock: product.current_stock,
                product_type: normalizedProductType,
                min_stock: product.min_stock,
            });

            const productWithBom = product as Product & {
                bill_of_materials?: Array<{
                    raw_material?: number;
                    raw_material_id?: number;
                    quantity?: number;
                }>;
            };

            const incomingBom =
                productWithBom.bom ??
                productWithBom.recipe ??
                productWithBom.bill_of_materials ??
                [];

            if (Array.isArray(incomingBom) && incomingBom.length > 0) {
                const parsedBom = incomingBom
                    .map((item: any) => ({
                        raw_material:
                            Number(item.raw_material ?? item.raw_material_id ?? 0) || 0,
                        quantity: Number(item.quantity) || 1,
                    }))
                    .filter((item) => item.raw_material > 0);

                if (parsedBom.length > 0) {
                    setBomItems(parsedBom);
                }
            }
        };

        loadProduct();
    }, [id]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const normalizedBom = bomItems
            .filter((item) => item.raw_material > 0 && item.quantity > 0)
            .map((item) => ({
                raw_material: item.raw_material,
                quantity: item.quantity,
            }));

        const payload: ProductUpsertPayload = {
            ...form,
            product_type: productType,
        };

        if (!isInsumoForm) {
            payload.bom = normalizedBom;
        }

        if (id) {
            await updateProduct(Number(id), payload);
            alert("Producto actualizado exitosamente");
        } else {
            await createProduct(payload);
            alert(`${isInsumoForm ? "Insumo" : "Producto"} creado exitosamente`);
        }

        navigate(isInsumoForm ? "/insumos" : "/productos");
    };

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

    return (
        <div>
            <PageMeta
                title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
                description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle={`${isEditMode ? "Editar" : "Crear"} ${isInsumoForm ? "insumo" : "producto"}`} />
            <ComponentCard>
                <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="name">Nombre</Label>
                        <Input 
                            placeholder="Difusor de aromas"
                            value={form.name}
                            onChange={(e) => setForm({...form, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <Label htmlFor="price">Precio</Label>
                        <Input 
                            type="number"
                            placeholder="1000"
                            value={form.price}
                            onChange={(e) => setForm({...form, price: parseFloat(e.target.value) || 0})}
                        />
                    </div>
                    <div>
                        <Label htmlFor="cost_last_production">Costo último de producción</Label>
                        <Input
                            type="number"
                            placeholder="700"
                            value={form.cost_last_production}
                            onChange={(e) => setForm({...form, cost_last_production: parseFloat(e.target.value) || 0})}
                        />
                    </div>
                    <div>
                        <Label htmlFor="initial_stock">Stock Inicial</Label>
                        <Input 
                            type="number"
                            placeholder="50"
                            value={form.current_stock}
                            onChange={(e) => setForm({...form, current_stock: parseInt(e.target.value) || 0})}
                        />
                    </div>
                    <div>
                        <Label htmlFor="min_stock">Stock Mínimo</Label>
                        <Input 
                            type="number"
                            placeholder="10"
                            value={form.min_stock}
                            onChange={(e) => setForm({...form, min_stock: parseInt(e.target.value) || 0})}
                        />
                    </div>
                    {!isInsumoForm && (
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
                                        <select
                                            value={item.raw_material || ""}
                                            onChange={(e) =>
                                                updateBomItem(index, "raw_material", Number(e.target.value))
                                            }
                                            className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                        >
                                            <option value="">Seleccionar insumo</option>
                                            {rawMaterials.map((material) => (
                                                <option key={material.id} value={material.id}>
                                                    {material.name}
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
                                                updateBomItem(
                                                    index,
                                                    "quantity",
                                                    Number(e.target.value) || 1
                                                )
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
                    )}
                    <div className="mt-4">
                        <Button type="submit">
                            {isEditMode
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