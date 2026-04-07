'use client'

import { cn } from "@/lib/utils";
import { SerializedStockMovement } from "@/types/stock";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { SearchInput } from "../ui/search-input";

export function StockTable({ movements }: { movements: SerializedStockMovement[] }) {
    const [search, setSearch] = useState('')

    const filtered = movements.filter(m => {
        const s = search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return (
            (m.product?.name || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(s) ||
            (m.product?.sku || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(s) ||
            (m.reason || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(s)
        );
    });

    const thClasses = "px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] text-left";

    return (
        <div className="flex flex-col">
            <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Buscar por producto o motivo..."
            />

            {filtered.length === 0 ? (
                <div className="py-20 text-center text-zinc-400 italic font-light">
                    No se encontraron movimientos registrados.
                </div>
            ) : (
                <>
                    {/* ── DESKTOP: tabla ── */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-100">
                                    <th className={thClasses}>Producto</th>
                                    <th className={thClasses}>Tipo</th>
                                    <th className={thClasses}>Cant.</th>
                                    <th className={thClasses}>Motivo</th>
                                    <th className={thClasses}>Usuario</th>
                                    <th className={thClasses}>Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {filtered.map((m) => (
                                    <tr key={m.id} className="group hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-base text-zinc-900">{m.product.name}</p>
                                            <p className="font-mono text-xs text-zinc-400 uppercase tracking-tighter">
                                                #{m.product.sku}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border",
                                                m.type === "IN"
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                    : "bg-red-50 text-red-700 border-red-100"
                                            )}>
                                                {m.type === "IN" ? "Entrada" : "Salida"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-base text-zinc-900">
                                            {m.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-500">
                                            {m.reason ?? "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-zinc-600 bg-zinc-100 px-2 py-1 rounded-md">
                                                {m.user.username}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                                                {new Date(m.createdAt).toLocaleDateString('es-AR')}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── MOBILE: cards ── */}
                    <div className="flex flex-col divide-y divide-zinc-100 md:hidden">
                        {filtered.map((m) => (
                            <div key={m.id} className="flex items-start justify-between px-4 py-4 hover:bg-zinc-50/50 transition-colors">
                                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={cn(
                                            "inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest border",
                                            m.type === "IN"
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                : "bg-red-50 text-red-700 border-red-100"
                                        )}>
                                            {m.type === "IN" ? "Entrada" : "Salida"}
                                        </span>
                                        <span className="font-bold text-base text-zinc-900">
                                            {m.quantity} u.
                                        </span>
                                    </div>
                                    <p className="font-bold text-base text-zinc-900 leading-snug">{m.product.name}</p>
                                    <p className="font-mono text-xs text-zinc-400 uppercase tracking-tighter">#{m.product.sku}</p>
                                    <div className="flex items-center gap-3 flex-wrap mt-0.5">
                                        {m.reason && (
                                            <span className="text-sm text-zinc-500">{m.reason}</span>
                                        )}
                                        <span className="text-sm font-medium text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md">
                                            {m.user.username}
                                        </span>
                                        <span className="text-sm text-zinc-400 flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                                            {new Date(m.createdAt).toLocaleDateString('es-AR')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}