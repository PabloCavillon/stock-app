'use client';

import { useState } from "react";
import Link from "next/link";
import { Eye, Calendar, ChevronRight } from "lucide-react";
import { SearchInput } from "../common/search-input";
import { STATUS_FLOW, STATUS_LABEL } from "@/types/order-status";
import { updateOrderStatus } from "@/actions/orders";
import { SerializedOrder } from "@/types/order";
import { OrderStatus } from "@/generated/prisma/enums";
import { useRouter } from "next/navigation";
import OrderStatusTooltip from './order-status-tooltip';

export default function OrdersTable({ orders: initialOrders }: { orders: SerializedOrder[] }) {
    const router = useRouter()
    const [orders, setOrders] = useState(initialOrders)
    const [search, setSearch] = useState("")
    const [updating, setUpdating] = useState<string | null>(null)

    const filtered = orders.filter(o => {
        const searchTerm = search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const customerName = o.customer?.name
            ? o.customer.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            : "";

        const orderId = o.id
            ? o.id.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            : "";

        return customerName.includes(searchTerm) || orderId.includes(searchTerm);
    });

    const handleAdvanceStatus = async (order: SerializedOrder) => {
        const nextStatus: OrderStatus = STATUS_FLOW[order.status] as OrderStatus
        if (!nextStatus) return
        setUpdating(order.id)
        await updateOrderStatus(order.id, nextStatus as OrderStatus)
        setOrders((prev) =>
            prev.map((o) => o.id === order.id ? { ...o, status: nextStatus } : o)
        )
        setUpdating(null)
        router.refresh()
    }

    const thClasses = "px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] text-left"

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
                            filtered.map((order) => {
                                const nextStatus = STATUS_FLOW[order.status] as OrderStatus | undefined;
                                return (
                                    <tr key={order.id} className="group hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-[10px] text-zinc-400 uppercase tracking-tighter">
                                            #{order.id.slice(-6)}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-zinc-900">
                                            {order.customer?.name || "Consumidor Final"}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500">
                                            <span className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                                                {new Date(order.createdAt).toLocaleDateString('es-AR')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-zinc-900">
                                            ${Number(order.total).toLocaleString('es-AR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <OrderStatusTooltip order={order} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {nextStatus && (
                                                    <button
                                                        onClick={() => handleAdvanceStatus(order)}
                                                        disabled={updating === order.id}
                                                        title={`Mark as ${STATUS_LABEL[nextStatus]}`}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 transition-all disabled:opacity-50"
                                                    >
                                                        {updating === order.id ? (
                                                            <span className="animate-pulse">...</span>
                                                        ) : (
                                                            <>
                                                                {STATUS_LABEL[nextStatus]}
                                                                <ChevronRight className="w-3 h-3" />
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 transition-all hover:shadow-sm"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
