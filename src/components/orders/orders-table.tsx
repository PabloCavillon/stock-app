'use client';

import { useState } from "react";
import Link from "next/link";
import { Eye, Calendar, ChevronRight, Store } from "lucide-react";
import { SearchInput } from "../ui/search-input";
import { STATUS_FLOW, STATUS_LABEL, STATUS_STYLE, STORE_STATUS_FLOW, STORE_STATUS_LABEL, STORE_STATUS_STYLE } from "@/types/order-status";
import { updateOrderStatus } from "@/actions/orders";
import { updateStoreOrderStatusAdmin } from "@/actions/store/store-orders.actions";
import { UnifiedOrder } from "@/types/unified-order";
import { OrderStatus, StoreOrderStatus } from "@/generated/prisma/enums";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import DownloadReceiptButton from "../receipts/DownloadReceiptButton";

function StatusBadge({ order }: { order: UnifiedOrder }) {
    if (order.source === "store") {
        const style = STORE_STATUS_STYLE[order.status as StoreOrderStatus] ?? "bg-zinc-50 text-zinc-500 border-zinc-100";
        const label = STORE_STATUS_LABEL[order.status as StoreOrderStatus] ?? order.status;
        return (
            <span className={cn("inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border", style)}>
                {label}
            </span>
        );
    }
    const style = STATUS_STYLE[order.status as OrderStatus] ?? "bg-zinc-50 text-zinc-500 border-zinc-100";
    const label = STATUS_LABEL[order.status as OrderStatus] ?? order.status;
    return (
        <span className={cn("inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border", style)}>
            {label}
        </span>
    );
}

function getNextStatus(order: UnifiedOrder): string | null {
    if (order.source === "store") return STORE_STATUS_FLOW[order.status as StoreOrderStatus] ?? null;
    return STATUS_FLOW[order.status as OrderStatus] ?? null;
}

function getNextLabel(order: UnifiedOrder, next: string): string {
    if (order.source === "store") return STORE_STATUS_LABEL[next as StoreOrderStatus] ?? next;
    return STATUS_LABEL[next as OrderStatus] ?? next;
}

export default function OrdersTable({ orders: initialOrders }: { orders: UnifiedOrder[] }) {
    const router = useRouter();
    const [orders, setOrders] = useState(initialOrders);
    const [search, setSearch] = useState("");
    const [updating, setUpdating] = useState<string | null>(null);

    const filtered = orders.filter((order) => {
        const term = search.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
        const name = order.customerName.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
        const code = order.code.toLowerCase();
        return name.includes(term) || code.includes(term);
    });

    const handleAdvanceStatus = async (order: UnifiedOrder) => {
        const next = getNextStatus(order);
        if (!next) return;
        setUpdating(order.id);
        if (order.source === "store") {
            await updateStoreOrderStatusAdmin(order.id, next as StoreOrderStatus);
        } else {
            await updateOrderStatus(order.id, next as OrderStatus);
        }
        setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: next } : o));
        setUpdating(null);
        router.refresh();
    };

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
                                    const next = getNextStatus(order);
                                    return (
                                        <tr key={order.id} className="group hover:bg-zinc-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-sm text-zinc-500 uppercase tracking-tighter">
                                                <div className="flex items-center gap-2">
                                                    {order.source === "store" && (
                                                        <Store className="w-3 h-3 text-indigo-400 shrink-0" aria-label="Pedido de tienda" />
                                                    )}
                                                    {order.code.split('-')[1]}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-base text-zinc-900">
                                                {order.customerName}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-zinc-500">
                                                <span className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                                                    {new Date(order.createdAt).toLocaleDateString('es-AR')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-base text-zinc-900">
                                                ${order.totalArs.toLocaleString('es-AR')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge order={order} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {next && (
                                                        <button
                                                            onClick={() => handleAdvanceStatus(order)}
                                                            disabled={updating === order.id}
                                                            title={`Marcar como ${getNextLabel(order, next)}`}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 transition-all disabled:opacity-50"
                                                        >
                                                            {updating === order.id ? (
                                                                <span className="animate-pulse">...</span>
                                                            ) : (
                                                                <>
                                                                    {getNextLabel(order, next)}
                                                                    <ChevronRight className="w-3 h-3" />
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                    {order.source === "manual" && (
                                                        <DownloadReceiptButton orderId={order.id} orderCode={order.code} variant="icon" />
                                                    )}
                                                    <Link
                                                        href={order.source === "store" ? `/admin/store-orders/${order.id}` : `/admin/orders/${order.id}`}
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
                            const next = getNextStatus(order);
                            return (
                                <div key={order.id} className="flex items-start justify-between px-4 py-4 hover:bg-zinc-50/50 transition-colors">
                                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-mono text-xs text-zinc-400 uppercase tracking-tighter bg-zinc-100/50 px-2 py-0.5 rounded flex items-center gap-1">
                                                {order.source === "store" && <Store className="w-2.5 h-2.5 text-indigo-400" />}
                                                {order.code.split('-')[1]}
                                            </span>
                                            <StatusBadge order={order} />
                                        </div>
                                        <p className="font-bold text-base text-zinc-900 leading-snug">
                                            {order.customerName}
                                        </p>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="text-sm text-zinc-500 flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                                                {new Date(order.createdAt).toLocaleDateString('es-AR')}
                                            </span>
                                            <span className="font-bold text-base text-zinc-900">
                                                ${order.totalArs.toLocaleString('es-AR')}
                                            </span>
                                        </div>
                                        {next && (
                                            <button
                                                onClick={() => handleAdvanceStatus(order)}
                                                disabled={updating === order.id}
                                                className="mt-1 self-start inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 bg-zinc-50 hover:bg-white border border-zinc-200 transition-all disabled:opacity-50"
                                            >
                                                {updating === order.id ? (
                                                    <span className="animate-pulse">...</span>
                                                ) : (
                                                    <>
                                                        {getNextLabel(order, next)}
                                                        <ChevronRight className="w-3 h-3" />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 ml-3 shrink-0">
                                        {order.source === "manual" && (
                                            <DownloadReceiptButton orderId={order.id} orderCode={order.code} variant="icon" />
                                        )}
                                        <Link
                                            href={order.source === "store" ? `/admin/store-orders/${order.id}` : `/admin/orders/${order.id}`}
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
