'use client';

import { useState } from "react";
import Link from "next/link";
import { Eye, MoreHorizontal, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchInput } from "../common/search-input";

export default function OrdersTable({ orders }: { orders: any[] }) {
    const [search, setSearch] = useState("");

    const filtered = orders.filter(o =>
        o.customer?.name.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase())
    );

    const thClasses = "px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] text-left";

    return (
        <div className="flex flex-col">
            
            <SearchInput value={search} onChange={setSearch} />

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-50">
                            <th className={thClasses}>ID Orden</th>
                            <th className={thClasses}>Cliente</th>
                            <th className={thClasses}>Fecha</th>
                            <th className={thClasses}>Total</th>
                            <th className={thClasses}>Estado</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center text-zinc-400 italic font-light">
                                    No se encontraron órdenes registradas.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((order) => (
                                <tr key={order.id} className="group hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-[10px] text-zinc-400 uppercase tracking-tighter">
                                        #{order.id.slice(-6)}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-zinc-900">
                                        {order.customer?.name || "Consumidor Final"}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                                        {new Date(order.createdAt).toLocaleDateString('es-AR')}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-zinc-900">
                                        ${Number(order.total).toLocaleString('es-AR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                            order.status === "DELIVERED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                order.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-100" :
                                                    "bg-zinc-50 text-zinc-500 border-zinc-100"
                                        )}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/orders/${order.id}`}
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 transition-all shadow-none hover:shadow-sm"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
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
