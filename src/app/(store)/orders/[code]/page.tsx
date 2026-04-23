import { redirect, notFound } from "next/navigation";
import { getStoreSession } from "@/lib/store-auth";
import { getMyStoreOrder } from "@/actions/store/store-orders.actions";
import { getPriceConfig } from "@/actions/config";
import { calcPriceArs } from "@/lib/price-utils";
import Link from "next/link";
import { ChevronLeft, Package, MessageCircle } from "lucide-react";
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

    const whatsappMsg = `Hola! Realicé la orden ${order.code}, quería coordinar el pago y el envío/retiro.`;
    const whatsappUrl = `https://wa.me/5493873443522?text=${encodeURIComponent(whatsappMsg)}`;

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <Link
                href="/orders"
                className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors gap-1.5 group"
            >
                <ChevronLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                Mis pedidos
            </Link>

            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="font-black text-gray-900 font-mono text-lg tracking-wide">{order.code}</p>
                    <span className={cn(
                        "inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border",
                        STATUS_STYLE[order.status] ?? "bg-gray-50 text-gray-500 border-gray-200"
                    )}>
                        {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                </div>
                <p className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                </p>

                {order.status === "PENDING" && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-3 dark:bg-amber-900/20 dark:border-amber-700/30">
                        <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                            Tu pedido está listo. Contactanos por WhatsApp para coordinar el <strong>pago y la entrega</strong>.
                        </p>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-xl text-sm transition-colors active:scale-[0.98]"
                        >
                            <MessageCircle size={16} />
                            Coordinar por WhatsApp
                        </a>
                    </div>
                )}
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden shadow-sm">
                <p className="px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
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
                                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                    <Package size={15} className="text-gray-300" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{item.productName ?? "Producto"}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
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

            {/* Totals */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 shadow-sm">
                {order.discountApplied > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                        <span>
                            Descuento {order.discountType === "GUILD" ? "gremio" : "por volumen"} ({order.discountApplied}%)
                        </span>
                        <span className="font-semibold">−{fmtArs(discountArs)}</span>
                    </div>
                )}

                {order.totalArs !== null ? (
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="font-black text-gray-900">Total confirmado</span>
                        <span className="text-2xl font-black text-gray-900">{fmtArs(order.totalArs)}</span>
                    </div>
                ) : (
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="font-black text-gray-900">Total estimado</span>
                        <div className="text-right">
                            <p className="text-2xl font-black text-gray-900">{fmtArs(totalEstimated)}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Sujeto a cotización al momento del pago</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
