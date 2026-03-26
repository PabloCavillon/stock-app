'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProduct, updateProduct } from "@/actions/products";
import { ProductFormData, ProductFormInput, productSchema } from '@/lib/validations/product';
import { SerializedProduct } from "@/types/product";
import { Loader2, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ProductForm Component
 * Style: Clean Functional Minimalism
 * Language: English logic / Spanish UI
 */
export function ProductForm({ product }: { product?: SerializedProduct }) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<ProductFormInput, unknown, ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            sku: product?.sku ?? '',
            name: product?.name ?? '',
            description: product?.description ?? '',
            price: product ? Number(product.price) : undefined,
            stock: product?.stock ?? 0,
            category: product?.category ?? '',
        }
    });

    const onSubmit = async (data: ProductFormData) => {
        setServerError(null);
        try {
            if (product) {
                await updateProduct(product.id, data);
            } else {
                await createProduct(data);
            }
            router.push("/products");
            router.refresh();
        } catch {
            setServerError("Hubo un error al guardar el producto. Por favor, intenta de nuevo.");
        }
    };

    // Shared Styles
    const labelStyles = "text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 ml-1";
    const inputStyles = "w-full border border-zinc-200 rounded-lg px-4 py-2.5 text-sm transition-all outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:bg-zinc-50 disabled:text-zinc-400 placeholder:text-zinc-300";
    const errorStyles = "text-xs font-medium text-red-500 mt-1.5 ml-1";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* Informacion Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label className={labelStyles}>Código SKU</label>
                    <input
                        {...register("sku")}
                        placeholder="EJ: PROD-001"
                        className={cn(inputStyles, errors.sku && "border-red-200 bg-red-50/30")}
                    />
                    {errors.sku && <p className={errorStyles}>{errors.sku.message}</p>}
                </div>

                <div className="flex flex-col">
                    <label className={labelStyles}>Nombre del Producto</label>
                    <input
                        {...register("name")}
                        placeholder="Nombre descriptivo"
                        className={cn(inputStyles, errors.name && "border-red-200 bg-red-50/30")}
                    />
                    {errors.name && <p className={errorStyles}>{errors.name.message}</p>}
                </div>
            </div>

            <div className="flex flex-col">
                <label className={labelStyles}>
                    Descripción <span className="text-zinc-300 font-normal lowercase">(opcional)</span>
                </label>
                <textarea
                    {...register("description")}
                    rows={3}
                    placeholder="Detalles adicionales del producto..."
                    className={cn(inputStyles, "resize-none")}
                />
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label className={labelStyles}>Precio (ARS)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                        <input
                            {...register("price")}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className={cn(inputStyles, "pl-8", errors.price && "border-red-200")}
                        />
                    </div>
                    {errors.price && <p className={errorStyles}>{errors.price.message}</p>}
                </div>

                {!product && (
                    <div className="flex flex-col">
                        <label className={labelStyles}>Stock Inicial</label>
                        <input
                            {...register("stock")}
                            type="number"
                            placeholder="0"
                            className={cn(inputStyles, errors.stock && "border-red-200")}
                        />
                        {errors.stock && <p className={errorStyles}>{errors.stock.message}</p>}
                    </div>
                )}
            </div>

            <div className="flex flex-col">
                <label className={labelStyles}>Categoría</label>
                <input
                    {...register("category")}
                    placeholder="Ej: Electrónica, Seguridad..."
                    className={cn(inputStyles, errors.category && "border-red-200")}
                />
                {errors.category && <p className={errorStyles}>{errors.category.message}</p>}
            </div>

            {serverError && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium">
                    {serverError}
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse md:flex-row gap-3 pt-6 border-t border-zinc-100">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 md:flex-none inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors gap-2"
                >
                    <X className="w-4 h-4" />
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 md:flex-none inline-flex items-center justify-center px-8 py-2.5 rounded-lg text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-70 transition-all active:scale-[0.98] gap-2 shadow-sm"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {product ? "Guardar Cambios" : "Crear Producto"}
                </button>
            </div>
        </form>
    );
}