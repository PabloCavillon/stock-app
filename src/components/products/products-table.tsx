'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/actions/products";
import { cn } from "@/lib/utils";
import { SerializedProduct } from "@/types/product";
import { Search, Edit2, Trash2, Loader2 } from "lucide-react";

interface Props {
    products: SerializedProduct[];
}

export default function ProductsTable({ products: initialProducts }: Props) {
    const router = useRouter();
    const [products, setProducts] = useState<SerializedProduct[]>(initialProducts);
    const [search, setSearch] = useState("");
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

    const filteredProducts = products.filter(p =>
        [p.name, p.sku, p.category].some(field =>
            field.toLowerCase().includes(search.toLowerCase())
        )
    );

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

    return (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            {/* Table Toolbar */}
            <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, SKU o categoría..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-zinc-200 rounded-lg outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                    />
                </div>
            </div>

            {/* Table View */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50/50 border-b border-zinc-100 text-zinc-500 font-medium">
                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">SKU / Ref</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Producto</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Categoría</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Precio</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Stock</th>
                            <th className="px-6 py-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center">
                                    <p className="text-zinc-400 italic">No se encontraron productos en tu inventario.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map(product => (
                                <tr key={product.id} className="group hover:bg-zinc-50/50 transition-colors duration-150">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs text-zinc-400 bg-zinc-100 px-2 py-1 rounded">
                                            {product.sku}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-zinc-900">{product.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500">
                                        {product.category}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-zinc-900">
                                        ${Number(product.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                            product.stock === 0 && "bg-red-50 text-red-700 border-red-100",
                                            product.stock > 0 && product.stock < 5 && "bg-amber-50 text-amber-700 border-amber-100",
                                            product.stock >= 5 && "bg-emerald-50 text-emerald-700 border-emerald-100"
                                        )}>
                                            {product.stock} disp.
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <Link
                                                href={`/products/${product.id}/edit`}
                                                className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-white rounded-md shadow-sm border border-transparent hover:border-zinc-200 transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                disabled={isDeletingId === product.id}
                                                className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md border border-transparent hover:border-red-100 transition-all"
                                            >
                                                {isDeletingId === product.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-red-600" />
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