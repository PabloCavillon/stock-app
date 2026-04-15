'use client'

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { upload } from "@vercel/blob/client";
import { createProduct, updateProduct } from "@/actions/products";
import { ProductFormData, ProductFormInput, productSchema } from '@/lib/validations/product';
import { SerializedProduct } from "@/types/product";
import { ImagePlus, Loader2, Save, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductForm({ product }: { product?: SerializedProduct }) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string>(product?.imageUrl ?? "");
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductFormInput, unknown, ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            sku: product?.sku ?? '',
            name: product?.name ?? '',
            description: product?.description ?? '',
            imageUrl: product?.imageUrl ?? '',
            price: product ? Number(product.price) : undefined,
            stock: product?.stock ?? 0,
            category: product?.category ?? '',
        }
    });

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadError(null);
        try {
            const blob = await upload(file.name, file, {
                access: "public",
                handleUploadUrl: "/api/upload",
            });
            setImageUrl(blob.url);
        } catch {
            setUploadError("Error al subir la imagen. Intentá de nuevo.");
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data: ProductFormData) => {
        setServerError(null);
        try {
            const payload = { ...data, imageUrl: imageUrl || undefined };
            if (product) await updateProduct(product.id, payload);
            else await createProduct(payload);
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

            {/* Imagen */}
            <div className="flex flex-col">
                <label className={labelClasses}>Imagen del producto</label>
                <div className="flex items-start gap-4">
                    {/* Preview */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            "w-28 h-28 rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden shrink-0 transition-all",
                            uploading ? "opacity-60 cursor-wait" : "hover:border-zinc-400 hover:bg-zinc-50",
                            imageUrl ? "border-zinc-300 bg-white" : "border-zinc-200 bg-zinc-50"
                        )}
                    >
                        {uploading ? (
                            <Loader2 size={24} className="text-zinc-400 animate-spin" />
                        ) : imageUrl ? (
                            <div className="relative w-full h-full">
                                <Image src={imageUrl} alt="Preview" fill className="object-contain p-2" unoptimized />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-1 text-zinc-400">
                                <ImagePlus size={22} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Subir</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm font-bold text-zinc-600 hover:bg-zinc-50 hover:border-zinc-400 disabled:opacity-60 transition-all"
                        >
                            <ImagePlus size={15} />
                            {imageUrl ? "Cambiar imagen" : "Subir imagen"}
                        </button>
                        {imageUrl && (
                            <button
                                type="button"
                                onClick={() => setImageUrl("")}
                                className="text-xs text-red-500 hover:text-red-700 text-left transition-colors"
                            >
                                Quitar imagen
                            </button>
                        )}
                        <p className="text-xs text-zinc-400">JPG, PNG o WebP · máx. 5 MB</p>
                        {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
                    </div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                />
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