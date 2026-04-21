import { redirect } from "next/navigation";
import { getStoreSession } from "@/lib/store-auth";
import { getMyStoreOrders } from "@/actions/store/store-orders.actions";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = { title: "Mis pedidos" };

const STATUS_LABEL: Record<string, string> = {
    PENDING: "Pendiente",
    PAYMENT_REGISTERED: "Pago registrado",
    CONFIRMED: "Confirmado",
    SHIPPED: "En camino",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
};

const STATUS_STYLE: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-100",
    PAYMENT_REGISTERED: "bg-blue-50 text-blue-700 border-blue-100",
    CONFIRMED: "bg-indigo-50 text-indigo-700 border-indigo-100",
    SHIPPED: "bg-purple-50 text-purple-700 border-purple-100",
    DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    CANCELLED: "bg-red-50 text-red-700 border-red-100",
};

function fmtArs(n: number) {
    return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

export default async function MyOrdersPage() {
    const session = await getStoreSession();
    if (!session) redirect("/login?redirect=/orders");

    const orders = await getMyStoreOrders();

    return (
        <div className="max-w-2xl mx-auto space-y-6 px-0 sm:px-0">
            <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Mis pedidos</h1>
                <p className="text-sm text-gray-400 mt-1">{orders.length} pedidos realizados</p>
            </div>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                    <Package size={40} className="text-gray-300" />
                    <p className="text-gray-500 font-medium">Todavía no realizaste ningún pedido.</p>
                    <Link href="/store" className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">
                        Ir al catálogo
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                    {orders.map((order) => (
                        <Link
                            key={order.id}
                            href={`/orders/${order.code}`}
                            className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors group"
                        >
                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-gray-900 text-sm font-mono">{order.code}</span>
                                    <span className={cn(
                                        "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                        STATUS_STYLE[order.status] ?? "bg-gray-50 text-gray-500 border-gray-100"
                                    )}>
                                        {STATUS_LABEL[order.status] ?? order.status}
                                    </span>
                                    {order.discountApplied > 0 && (
                                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-100">
                                            −{order.discountApplied}%
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400">
                                    {order.items.length} artículo{order.items.length !== 1 ? "s" : ""} ·{" "}
                                    {new Date(order.createdAt).toLocaleDateString("es-AR")}
                                </p>
                                {order.totalArs !== null && (
                                    <p className="text-sm font-bold text-gray-900">{fmtArs(order.totalArs)}</p>
                                )}
                            </div>
                            <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0 ml-2" />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
