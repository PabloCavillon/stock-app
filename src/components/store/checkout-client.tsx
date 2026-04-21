'use client';

import { useCart } from "@/contexts/cart-context";
import { createStoreOrder } from "@/actions/store/store-orders.actions";
import { calcPriceArs, type PriceInfo } from "@/lib/price-utils";
import { Loader2, Tag, ArrowRight, ShoppingCart, Boxes, Package, Box } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function fmtArs(n: number) {
    return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

interface CheckoutClientProps {
    config: PriceInfo & { guildDiscountPct: number; volumeDiscountPct: number; volumeThresholdArs: number };
    isGuild: boolean;
    customerName: string;
}

export function CheckoutClient({ config, isGuild, customerName }: CheckoutClientProps) {
    const { items, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                <ShoppingCart size={36} className="text-gray-300" />
                <p className="text-gray-500 font-medium">Tu carrito está vacío.</p>
                <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">
                    Ir al catálogo
                </Link>
            </div>
        );
    }

    const subtotalArs = items.reduce(
        (acc, i) => acc + calcPriceArs(i.priceUsd, config) * i.quantity,
        0,
    );

    const guildDiscount = isGuild ? config.guildDiscountPct : 0;
    const volumeDiscount = subtotalArs >= config.volumeThresholdArs ? config.volumeDiscountPct : 0;
    const discountPct = Math.max(guildDiscount, volumeDiscount);
    const discountType = discountPct === 0 ? null : guildDiscount >= volumeDiscount ? "GUILD" : "VOLUME";
    const discountArs = subtotalArs * (discountPct / 100);
    const totalArs = subtotalArs - discountArs;

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);
        const result = await createStoreOrder(
            items.map((i) => ({
                productId: i.type === "product" ? i.id : undefined,
                kitId: i.type === "kit" ? i.id : undefined,
                quantity: i.quantity,
                unit: i.unit,
                unitsPerBox: i.unitsPerBox,
            })),
        );
        setLoading(false);

        if ("error" in result) {
            setError(result.error);
            return;
        }

        clearCart();
        router.push(`/orders/${result.code}`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Confirmá tu pedido</h1>
                <p className="text-sm text-gray-400 mt-1">Hola, <strong>{customerName}</strong></p>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                {items.map((item) => {
                    const lineArs = calcPriceArs(item.priceUsd, config) * item.quantity;
                    return (
                        <div key={item.cartKey} className="flex items-center justify-between px-5 py-4 gap-4">
                            <div className="shrink-0 text-gray-300">
                                {item.type === "kit" ? <Boxes size={16} /> : item.unit === "box" ? <Box size={16} /> : <Package size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    {item.type === "kit" && (
                                        <span className="text-[9px] font-black uppercase tracking-widest bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full">Kit</span>
                                    )}
                                    {item.unit === "box" && (
                                        <span className="text-[9px] font-black uppercase tracking-widest bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                                            Caja ×{item.unitsPerBox}
                                        </span>
                                    )}
                                    {item.isOffer && (
                                        <span className="text-[9px] font-black uppercase tracking-widest bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                            <Tag size={8} />
                                            Oferta
                                        </span>
                                    )}
                                    <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {item.quantity} × {fmtArs(calcPriceArs(item.priceUsd, config))}
                                </p>
                            </div>
                            <p className="font-bold text-gray-900 text-sm shrink-0">{fmtArs(lineArs)}</p>
                        </div>
                    );
                })}
            </div>

            {/* Totales */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">{fmtArs(subtotalArs)}</span>
                </div>

                {discountPct > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                        <span className="flex items-center gap-1.5">
                            <Tag size={13} />
                            Descuento {discountType === "GUILD" ? "gremio" : "por volumen"} ({discountPct}%)
                        </span>
                        <span className="font-bold">−{fmtArs(discountArs)}</span>
                    </div>
                )}

                {discountPct === 0 && subtotalArs > 0 && (
                    <p className="text-xs text-gray-400">
                        {isGuild
                            ? `Tenés descuento de gremio del ${config.guildDiscountPct}%.`
                            : `Compras mayores a ${fmtArs(config.volumeThresholdArs)} obtienen ${config.volumeDiscountPct}% de descuento.`
                        }
                    </p>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="font-black text-gray-900">Total estimado</span>
                    <span className="text-xl font-black text-gray-900">{fmtArs(totalArs)}</span>
                </div>

                <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3">
                    El total definitivo se confirma al momento del pago según la cotización vigente.
                    Cotización de referencia: $&thinsp;{config.dollarRate.toLocaleString("es-AR")} ARS/USD
                </p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                    {error}
                </div>
            )}

            <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
            >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                {loading ? "Procesando..." : "Confirmar pedido"}
            </button>

            <Link href="/cart" className="block text-center text-sm text-gray-400 hover:text-gray-700 transition-colors">
                Volver al carrito
            </Link>
        </div>
    );
}
