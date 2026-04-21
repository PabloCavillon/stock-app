'use client';

import { StoreProduct } from "@/actions/store/products.actions";
import { AddToCartControls } from "@/components/store/add-to-cart-controls";
import { Box, ChevronLeft, Package, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function fmtArs(n: number) {
    return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

export function ProductDetailClient({ product }: { product: StoreProduct }) {
    const router = useRouter();
    const [unit, setUnit] = useState<"unit" | "box">("unit");

    const hasBox = product.unitsPerBox !== null && product.unitsPerBox > 0;
    const selectedUnit = hasBox ? unit : "unit";
    const offerApplies = product.offerDiscountPct !== null && product.offerUnit === selectedUnit;

    let effectivePriceUsd: number;
    if (selectedUnit === "box") {
        effectivePriceUsd = offerApplies
            ? product.offerPriceUsd!
            : product.priceUsd * product.unitsPerBox!;
    } else {
        effectivePriceUsd = offerApplies ? product.offerPriceUsd! : product.priceUsd;
    }

    const regularPriceArs = selectedUnit === "box"
        ? product.priceArs * product.unitsPerBox!
        : product.priceArs;
    const displayPriceArs = offerApplies ? product.offerPriceArs! : regularPriceArs;

    const cartKey = `product:${product.id}:${selectedUnit}`;

    // For box selling, max = floor(stock / unitsPerBox); for unit, max = stock
    const maxQuantity = selectedUnit === "box"
        ? Math.floor(product.stock / product.unitsPerBox!)
        : product.stock;

    return (
        <>
            {/* Botón volver — usa router.back() para preservar scroll del catálogo */}
            <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors group col-span-full"
            >
                <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Volver al catálogo
            </button>

            <div className="flex flex-col gap-5">
                {/* Badges de stock y oferta */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2.5 py-1 rounded-full">
                        {product.category}
                    </span>
                    {product.stock > 0 ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {product.stock} en stock
                        </span>
                    ) : (
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Sin stock disponible
                        </span>
                    )}
                    {product.offerDiscountPct !== null && product.offerUnit !== null && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            <Tag size={9} />
                            -{product.offerDiscountPct}% por {product.offerUnit === "box" ? "caja" : "unidad"}
                        </span>
                    )}
                </div>

                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                        {product.name}
                    </h1>
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">#{product.sku}</p>
                </div>

                {/* Descripción */}
                {product.description && (
                    <div className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4 whitespace-pre-line">
                        {product.description}
                    </div>
                )}

                {/* Selector caja/unidad */}
                {hasBox && (
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Vender por</p>
                        <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm font-bold max-w-xs">
                            <button
                                onClick={() => setUnit("unit")}
                                className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors ${unit === "unit" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"}`}
                            >
                                <Package size={14} />
                                Por unidad
                            </button>
                            <button
                                onClick={() => setUnit("box")}
                                className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors ${unit === "box" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"}`}
                            >
                                <Box size={14} />
                                Caja ×{product.unitsPerBox}
                            </button>
                        </div>
                    </div>
                )}

                {/* Precio */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
                    {offerApplies && (
                        <p className="text-sm text-gray-400 line-through">{fmtArs(regularPriceArs)}</p>
                    )}
                    <p className={`text-3xl font-black ${offerApplies ? "text-rose-600" : "text-gray-900"}`}>
                        {fmtArs(displayPriceArs)}
                    </p>
                    {selectedUnit === "box" && (
                        <p className="text-xs text-gray-500">
                            {offerApplies
                                ? `Oferta: ${fmtArs(product.offerPriceArs!)} por caja de ${product.unitsPerBox} unidades`
                                : `${fmtArs(product.priceArs)} × ${product.unitsPerBox} unidades`
                            }
                        </p>
                    )}
                </div>

                {/* Controles de carrito */}
                <AddToCartControls
                    item={{
                        cartKey,
                        type: "product",
                        id: product.id,
                        name: product.name,
                        sku: product.sku,
                        priceUsd: effectivePriceUsd,
                        imageUrl: product.imageUrl,
                        unit: selectedUnit,
                        unitsPerBox: selectedUnit === "box" ? product.unitsPerBox! : undefined,
                        isOffer: offerApplies,
                    }}
                    maxQuantity={maxQuantity}
                />

                <Link
                    href="/cart"
                    className="text-center text-sm text-gray-400 hover:text-gray-700 transition-colors"
                >
                    Ver carrito
                </Link>
            </div>
        </>
    );
}
