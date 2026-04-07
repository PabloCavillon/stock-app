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
import DownloadReceiptButton from "../receipts/DownloadReceiptButton";

export default function OrdersTable({ orders: initialOrders }: { orders: SerializedOrder[] }) {
    const router = useRouter()
    const [orders, setOrders] = useState(initialOrders)
    const [search, setSearch] = useState("")
    const [updating, setUpdating] = useState<string | null>(null)

    const filtered: SerializedOrder[] = orders.filter(order => {
        const searchTerm = search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const customerName = order.customer?.name
            ? order.customer.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            : "";

        const orderId = order.id
            ? order.id.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            : "";

        const orderCode = order.code
            ? order.code.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            : "";

        return customerName.includes(searchTerm) || orderId.includes(searchTerm) || orderCode.includes(searchTerm);
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

    const thClasses = "px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] text-left";

    return (
        <div className="flex flex-col">
            <SearchInput value={search} onChange={setSearch} />

            {filtered.length === 0 ? (
                <div className="py-20 text-center text-zinc-400 italic font-light">
                    No se encontraron órdenes registradas.
                </div>
            ) : (
                <>
                    {/* ── DESKTOP: tabla ── */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-100">
                                    <th className={thClasses}>ID Orden</th>
                                    <th className={thClasses}>Cliente</th>
                                    <th className={thClasses}>Fecha</th>
                                    <th className={thClasses}>Total</th>
                                    <th className={thClasses}>Estado</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {filtered.map((order) => {
                                    const nextStatus = STATUS_FLOW[order.status] as OrderStatus | undefined;
                                    return (
                                        <tr key={order.id} className="group hover:bg-zinc-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-sm text-zinc-500 uppercase tracking-tighter">
                                                {order.code.split('-')[1]}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-base text-zinc-900">
                                                {order.customer?.name || "Consumidor Final"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-zinc-500">
                                                <span className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                                                    {new Date(order.createdAt).toLocaleDateString('es-AR')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-base text-zinc-900">
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
                                                            title={`Marcar como ${STATUS_LABEL[nextStatus]}`}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 transition-all disabled:opacity-50"
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
                                                    <DownloadReceiptButton orderId={order.id} orderCode={order.code} variant="icon" />
                                                    <Link
                                                        href={`/orders/${order.id}`}
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 transition-all hover:shadow-sm"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* ── MOBILE: cards ── */}
                    <div className="flex flex-col divide-y divide-zinc-100 md:hidden">
                        {filtered.map((order) => {
                            const nextStatus = STATUS_FLOW[order.status] as OrderStatus | undefined;
                            return (
                                <div key={order.id} className="flex items-start justify-between px-4 py-4 hover:bg-zinc-50/50 transition-colors">
                                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-mono text-xs text-zinc-400 uppercase tracking-tighter bg-zinc-100/50 px-2 py-0.5 rounded">
                                                {order.code.split('-')[1]}
                                            </span>
                                            <OrderStatusTooltip order={order} />
                                        </div>
                                        <p className="font-bold text-base text-zinc-900 leading-snug">
                                            {order.customer?.name || "Consumidor Final"}
                                        </p>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="text-sm text-zinc-500 flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                                                {new Date(order.createdAt).toLocaleDateString('es-AR')}
                                            </span>
                                            <span className="font-bold text-base text-zinc-900">
                                                ${Number(order.total).toLocaleString('es-AR')}
                                            </span>
                                        </div>
                                        {nextStatus && (
                                            <button
                                                onClick={() => handleAdvanceStatus(order)}
                                                disabled={updating === order.id}
                                                className="mt-1 self-start inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 bg-zinc-50 hover:bg-white border border-zinc-200 transition-all disabled:opacity-50"
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
                                    </div>

                                    <div className="flex items-center gap-1 ml-3 shrink-0">
                                        <DownloadReceiptButton orderId={order.id} orderCode={order.code} variant="icon" />
                                        <Link
                                            href={`/orders/${order.id}`}
                                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 transition-all"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
