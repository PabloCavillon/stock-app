'use client'

import { cn } from "@/lib/utils";
import { SerializedStockMovement } from "@/types/stock";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { SearchInput } from "../common/search-input";

export function StockTable({ movements }: { movements: SerializedStockMovement[] }) {
    const [search, setSearch] = useState('')
    const filtered = movements.filter(m =>
        m.product.name.toLowerCase().includes(search.toLowerCase()) ||
        m.product.sku.toLowerCase().includes(search.toLowerCase()) ||
        m.reason?.toLowerCase().includes(search.toLowerCase())
    )

    const thClasses = "px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] text-left";

    return (
        <div className="flex flex-col">
            <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Buscar por producto o motivo..."
            />

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-50">
                            <th className={thClasses}>Producto</th>
                            <th className={thClasses}>Tipo</th>
                            <th className={thClasses}>Cant.</th>
                            <th className={thClasses}>Motivo</th>
                            <th className={thClasses}>Usuario</th>
                            <th className={thClasses}>Fecha</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center text-zinc-400 italic font-light">
                                    No se encontraron movimientos registrados.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((m) => (
                                <tr key={m.id} className="group hover:bg-zinc-50/50 transition-colors">
                                    {/* Producto y SKU */}
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-zinc-900">{m.product.name}</p>
                                        <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-tighter">
                                            #{m.product.sku}
                                        </p>
                                    </td>

                                    {/* Badge de Tipo (IN/OUT) */}
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                            m.type === "IN"
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                : "bg-red-50 text-red-700 border-red-100"
                                        )}>
                                            {m.type === "IN" ? "Entrada" : "Salida"}
                                        </span>
                                    </td>

                                    {/* Cantidad */}
                                    <td className="px-6 py-4 font-bold text-zinc-900">
                                        {m.quantity}
                                    </td>

                                    {/* Motivo */}
                                    <td className="px-6 py-4 text-zinc-500">
                                        {m.reason ?? "—"}
                                    </td>

                                    {/* Usuario */}
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-medium text-zinc-600 bg-zinc-100 px-2 py-1 rounded-md">
                                            {m.user.username}
                                        </span>
                                    </td>

                                    {/* Fecha */}
                                    <td className="px-6 py-4 text-zinc-400 text-xs">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                                            {new Date(m.createdAt).toLocaleDateString('es-AR')}
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