import { redirect } from "next/navigation";
import { getStoreSession } from "@/lib/store-auth";
import { getMyStoreOrders } from "@/actions/store/store-orders.actions";
import Link from "next/link";
import { Package, ChevronRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = { title: "Mis pedidos", robots: { index: false } };

const STATUS_LABEL: Record<string, string> = {
    PENDING: "Pendiente",
    PAYMENT_REGISTERED: "Pago registrado",
    CONFIRMED: "Confirmado",
    SHIPPED: "En camino",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
};

const STATUS_STYLE: Record<string, string> = {
    PENDING:            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/50",
    PAYMENT_REGISTERED: "bg-blue-50 text-blue-700 border-blue-200 dark:text-blue-300 dark:border-blue-700/40",
    CONFIRMED:          "bg-indigo-50 text-indigo-700 border-indigo-200 dark:text-indigo-400 dark:border-indigo-700/40",
    SHIPPED:            "bg-purple-50 text-purple-700 border-purple-200 dark:border-purple-700/40",
    DELIVERED:          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:border-emerald-700/40",
    CANCELLED:          "bg-red-50 text-red-600 border-red-200 dark:border-red-700/40",
};

function fmtArs(n: number) {
    return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

export default async function MyOrdersPage() {
    const session = await getStoreSession();
    if (!session) redirect("/login?redirect=/orders");

    const orders = await getMyStoreOrders();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mis pedidos</h1>
                <p className="text-sm text-gray-400 mt-1">{orders.length} pedidos realizados</p>
            </div>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <Package size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Todavía no realizaste ningún pedido.</p>
                    <Link href="/" className="text-indigo-600 hover:text-indigo-500 font-semibold text-sm transition-colors">
                        Ir al catálogo
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden shadow-sm">
                    {orders.map((order) => {
                        const isPending = order.status === "PENDING";
                        const waMsg = `Hola! Realicé la orden ${order.code}, quería coordinar el pago y el envío/retiro.`;
                        const waUrl = `https://wa.me/5493873443522?text=${encodeURIComponent(waMsg)}`;

                        return (
                            <div key={order.id} className="divide-y divide-gray-50">
                                <Link
                                    href={`/orders/${order.code}`}
                                    className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-bold text-gray-900 text-sm font-mono tracking-wide">{order.code}</span>
                                            <span className={cn(
                                                "inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border",
                                                STATUS_STYLE[order.status] ?? "bg-gray-50 text-gray-500 border-gray-200"
                                            )}>
                                                {STATUS_LABEL[order.status] ?? order.status}
                                            </span>
                                            {order.discountApplied > 0 && (
                                                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border bg-emerald-50 text-emerald-700 border-emerald-200">
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
                                    <ChevronRight size={15} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0 ml-2" />
                                </Link>

                                {isPending && (
                                    <a
                                        href={waUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-5 py-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] dark:text-[#25D366] font-semibold text-sm transition-colors"
                                    >
                                        <MessageCircle size={15} />
                                        Coordinar pago y envío por WhatsApp
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
