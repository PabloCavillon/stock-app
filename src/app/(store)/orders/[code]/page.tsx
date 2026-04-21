import { redirect, notFound } from "next/navigation";
import { getStoreSession } from "@/lib/store-auth";
import { getMyStoreOrder } from "@/actions/store/store-orders.actions";
import { getPriceConfig } from "@/actions/config";
import { calcPriceArs } from "@/lib/price-utils";
import Link from "next/link";
import { ChevronLeft, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
    PENDING: "Pendiente de pago",
    PAYMENT_REGISTERED: "Pago recibido",
    CONFIRMED: "Confirmado — en preparación",
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

export default async function OrderDetailPage({
    params,
}: {
    params: Promise<{ code: string }>;
}) {
    const { code } = await params;
    const session = await getStoreSession();
    if (!session) redirect(`/login?redirect=/orders/${code}`);

    const [order, config] = await Promise.all([getMyStoreOrder(code), getPriceConfig()]);
    if (!order) notFound();

    const priceConfig = config
        ? { dollarRate: config.dollarRate, shippingPct: config.shippingPct, profitPct: config.profitPct }
        : null;

    // Estimar total ARS con cotización de creación (hasta que admin registre pago)
    const estimatedArs = order.items.reduce((acc, i) => {
        if (!priceConfig) return acc;
        return acc + calcPriceArs(i.unitPriceUsd, {
            dollarRate: order.dollarRateAtCreation,
            shippingPct: priceConfig.shippingPct,
            profitPct: priceConfig.profitPct,
        }) * i.quantity;
    }, 0);

    const discountArs = estimatedArs * (order.discountApplied / 100);
    const totalEstimated = estimatedArs - discountArs;

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <Link
                href="/orders"
                className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors gap-1.5 group"
            >
                <ChevronLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                Mis pedidos
            </Link>

            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="font-black text-gray-900 font-mono text-lg">{order.code}</p>
                    <span className={cn(
                        "inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                        STATUS_STYLE[order.status] ?? "bg-gray-50 text-gray-500 border-gray-100"
                    )}>
                        {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                </div>
                <p className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                </p>

                {order.status === "PENDING" && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
                        Para confirmar el pedido, <strong>contactanos</strong> para coordinar el pago. Una vez registrado, comenzamos a prepararlo.
                    </div>
                )}
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                <p className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Artículos
                </p>
                {order.items.map((item) => {
                    const lineArs = priceConfig
                        ? calcPriceArs(item.unitPriceUsd, {
                            dollarRate: order.dollarRateAtCreation,
                            shippingPct: priceConfig.shippingPct,
                            profitPct: priceConfig.profitPct,
                        }) * item.quantity
                        : null;

                    return (
                        <div key={item.id} className="flex items-center justify-between px-5 py-4 gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                    <Package size={16} className="text-gray-300" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{item.productName ?? "Producto"}</p>
                                    <p className="text-xs text-gray-400">
                                        Cantidad: {item.quantity}
                                    </p>
                                </div>
                            </div>
                            {lineArs !== null && (
                                <p className="font-bold text-gray-900 text-sm shrink-0">{fmtArs(lineArs)}</p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Totales */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                {order.discountApplied > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                        <span>
                            Descuento {order.discountType === "GUILD" ? "gremio" : "por volumen"} ({order.discountApplied}%)
                        </span>
                        <span className="font-bold">−{fmtArs(discountArs)}</span>
                    </div>
                )}

                {order.totalArs !== null ? (
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="font-black text-gray-900">Total confirmado</span>
                        <span className="text-xl font-black text-gray-900">{fmtArs(order.totalArs)}</span>
                    </div>
                ) : (
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="font-black text-gray-900">Total estimado</span>
                        <div className="text-right">
                            <p className="text-xl font-black text-gray-900">{fmtArs(totalEstimated)}</p>
                            <p className="text-xs text-gray-400">Sujeto a cotización al momento del pago</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
