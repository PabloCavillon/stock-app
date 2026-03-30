'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/actions/products";
import { cn } from "@/lib/utils";
import { SerializedProduct } from "@/types/product";
import { Search, Edit2, Trash2, Loader2 } from "lucide-react";
import { SearchInput } from "../common/search-input";

interface Props {
    products: SerializedProduct[];
}

export default function ProductsTable({ products: initialProducts }: Props) {
    const router = useRouter();
    const [products, setProducts] = useState<SerializedProduct[]>(initialProducts);
    const [search, setSearch] = useState("");
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

    const filtered = products.filter(p => {
        const searchTerm = search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        return [p.name, p.sku, p.category].some(field => {
            if (!field) return false;
            const normalizedField = field.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return normalizedField.includes(searchTerm);
        });
    });

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.")) return;

        setIsDeletingId(id);
        try {
            await deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
            router.refresh();
        } catch (error) {
            console.error("Error deleting product", error);
        } finally {
            setIsDeletingId(null);
        }
    };

    const thClasses = "px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] text-left";

    return (
        <div className="flex flex-col">
            {/* Input de búsqueda integrado */}
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar productos..." />

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-50">
                            <th className={thClasses}>SKU / Ref</th>
                            <th className={thClasses}>Producto</th>
                            <th className={thClasses}>Categoría</th>
                            <th className={thClasses}>Precio</th>
                            <th className={thClasses}>Stock</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center text-zinc-400 italic font-light">
                                    No se encontraron productos en tu inventario.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((product) => (
                                <tr key={product.id} className="group hover:bg-zinc-50/50 transition-colors">
                                    {/* SKU con estilo Mono sutil */}
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-tighter bg-zinc-100/50 px-2 py-1 rounded">
                                            #{product.sku}
                                        </span>
                                    </td>

                                    {/* Nombre Destacado */}
                                    <td className="px-6 py-4 font-bold text-zinc-900">
                                        {product.name}
                                    </td>

                                    {/* Categoría */}
                                    <td className="px-6 py-4 text-zinc-500">
                                        {product.category}
                                    </td>

                                    {/* Precio con formato moneda */}
                                    <td className="px-6 py-4 font-bold text-zinc-900">
                                        ${Number(product.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                    </td>

                                    {/* Stock con Badges Dinámicos */}
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                            product.stock >= 5 ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                product.stock > 0 ? "bg-amber-50 text-amber-700 border-amber-100" :
                                                    "bg-red-50 text-red-700 border-red-100"
                                        )}>
                                            {product.stock} {product.stock > 1 ? 'disponibles' : 'disponible'}
                                        </span>
                                    </td>

                                    {/* Acciones - Aparecen al hacer Hover en la fila */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            <Link
                                                href={`/products/${product.id}/edit`}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 transition-all shadow-none hover:shadow-sm"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                disabled={isDeletingId === product.id}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                                            >
                                                {isDeletingId === product.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}