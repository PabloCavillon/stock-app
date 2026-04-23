'use client';

import { StoreProduct } from "@/actions/store/products.actions";
import { AddToCartControls } from "@/components/store/add-to-cart-controls";
import { fmtArs } from "@/lib/utils";
import { Box, ChevronLeft, Package, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

    // Por encargo: sin límite de cantidad (undefined = sin tope)
    const maxQuantity = product.isMadeToOrder
        ? undefined
        : selectedUnit === "box"
            ? Math.floor(product.stock / product.unitsPerBox!)
            : product.stock;

    return (
        <div className="flex flex-col gap-5">
            <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors group cursor-pointer w-fit"
            >
                <ChevronLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                Volver
            </button>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest bg-gray-100 px-2.5 py-1 rounded-full">
                    {product.category}
                </span>
                {product.stock > 0 ? (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {product.stock} en stock
                    </span>
                ) : product.isMadeToOrder ? (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Por encargo
                    </span>
                ) : (
                    <span className="text-[10px] font-semibold text-red-500 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Sin stock
                    </span>
                )}
                {product.offerDiscountPct !== null && product.offerUnit !== null && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        <Tag size={9} />
                        -{product.offerDiscountPct}% por {product.offerUnit === "box" ? "caja" : "unidad"}
                    </span>
                )}
            </div>

            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                    {product.name}
                </h1>
                <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mt-1">#{product.sku}</p>
            </div>

            {product.description && (
                <div className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4 whitespace-pre-line">
                    {product.description}
                </div>
            )}

            {/* Unit selector */}
            {hasBox && (
                <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Presentación</p>
                    <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm font-semibold max-w-xs bg-gray-50">
                        <button
                            onClick={() => setUnit("unit")}
                            className={`flex-1 py-2.5 flex items-center justify-center gap-2 transition-colors cursor-pointer ${unit === "unit" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            <Package size={13} />
                            Por unidad
                        </button>
                        <button
                            onClick={() => setUnit("box")}
                            className={`flex-1 py-2.5 flex items-center justify-center gap-2 transition-colors cursor-pointer ${unit === "box" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            <Box size={13} />
                            Caja ×{product.unitsPerBox}
                        </button>
                    </div>
                </div>
            )}

            {/* Price */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-1 border border-gray-100">
                {offerApplies && (
                    <p className="text-sm text-gray-400 line-through">{fmtArs(regularPriceArs)}</p>
                )}
                <p className={`text-3xl font-black leading-none ${offerApplies ? "text-rose-600" : "text-gray-900"}`}>
                    {fmtArs(displayPriceArs)}
                </p>
                {selectedUnit === "box" && (
                    <p className="text-xs text-gray-500 mt-1">
                        {offerApplies
                            ? `Oferta: ${fmtArs(product.offerPriceArs!)} por caja de ${product.unitsPerBox} unidades`
                            : `${fmtArs(product.priceArs)} × ${product.unitsPerBox} unidades`
                        }
                    </p>
                )}
            </div>

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
                    isMadeToOrder: product.isMadeToOrder,
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
    );
}
