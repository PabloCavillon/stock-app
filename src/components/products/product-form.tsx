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

export function ProductForm({ product }: { product?: SerializedProduct }) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductFormInput, unknown, ProductFormData>({
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
            if (product) await updateProduct(product.id, data);
            else await createProduct(data);
            router.push("/products");
            router.refresh();
        } catch {
            setServerError("Error al guardar el producto.");
        }
    };

    // --- MISMAS CLASES QUE EL LOGIN (COHERENCIA) ---
    const labelClasses = "text-xs font-bold text-zinc-600 uppercase tracking-[0.2em] mb-2 ml-1 block";
    const inputClasses = "w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-base transition-all outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 disabled:bg-zinc-50 placeholder:text-zinc-400 text-zinc-900";
    const buttonPrimary = "flex-1 md:flex-none inline-flex items-center justify-center px-10 py-3.5 rounded-xl text-base font-bold bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-70 transition-all active:scale-[0.98] gap-2 shadow-sm";
    const buttonSecondary = "flex-1 md:flex-none inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-bold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-all gap-2";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label className={labelClasses}>Código SKU</label>
                    <input
                        {...register("sku")}
                        placeholder="PROD-001"
                        className={cn(inputClasses, errors.sku && "border-red-200")}
                        disabled={!!product}
                    />
                    {errors.sku && <p className="text-sm text-red-500 mt-2 ml-1">{errors.sku.message}</p>}
                </div>

                <div className="flex flex-col">
                    <label className={labelClasses}>Nombre</label>
                    <input {...register("name")} placeholder="Nombre del producto" className={cn(inputClasses, errors.name && "border-red-200")} />
                    {errors.name && <p className="text-sm text-red-500 mt-2 ml-1">{errors.name.message}</p>}
                </div>
            </div>

            <div className="flex flex-col">
                <label className={labelClasses}>Descripción</label>
                <textarea {...register("description")} rows={3} placeholder="Detalles técnicos..." className={cn(inputClasses, "resize-none")} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label className={labelClasses}>Precio (USD)</label>
                    <input {...register("price")} type="number" step="0.01" className={inputClasses} />
                    {errors.price && <p className="text-sm text-red-500 mt-2 ml-1">{errors.price.message}</p>}
                </div>

                {!product && (
                    <div className="flex flex-col">
                        <label className={labelClasses}>Stock Inicial</label>
                        <input {...register("stock")} type="number" className={inputClasses} />
                        {errors.stock && <p className="text-sm text-red-500 mt-2 ml-1">{errors.stock.message}</p>}
                    </div>
                )}
            </div>

            <div className="flex flex-col">
                <label className={labelClasses}>Categoría</label>
                <input {...register("category")} placeholder="Seguridad, Alarmas..." className={inputClasses} />
                {errors.category && <p className="text-sm text-red-500 mt-2 ml-1">{errors.category.message}</p>}
            </div>

            {serverError && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                    {serverError}
                </div>
            )}

            <div className="flex flex-col-reverse md:flex-row gap-3 pt-8 border-t border-zinc-50">
                <button type="button" onClick={() => router.back()} className={buttonSecondary}>
                    <X className="w-4 h-4" /> Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className={buttonPrimary}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {product ? "Guardar Cambios" : "Crear Producto"}
                </button>
            </div>
        </form>
    );
}