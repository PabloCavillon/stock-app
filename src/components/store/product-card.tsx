'use client';

import { useCart } from "@/contexts/cart-context";
import { StoreProduct } from "@/actions/store/products.actions";
import { fmtArs } from "@/lib/utils";
import { Minus, Plus, ShoppingCart, Package, Tag, Box } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function ProductCard({ product }: { product: StoreProduct }) {
    const { addItem, updateQuantity, items } = useCart();
    const [imgError, setImgError] = useState(false);
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
    const inCart = items.find((i) => i.cartKey === cartKey);

    const handleAdd = () => {
        addItem({
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
        });
    };

    const hasOffer = product.offerDiscountPct !== null && product.offerUnit !== null;

    return (
        <div className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group relative border border-gray-100">
            {/* Offer badge */}
            {hasOffer && (
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 bg-rose-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                    <Tag size={8} />
                    -{product.offerDiscountPct}%
                </div>
            )}

            {/* Image */}
            <Link href={`/products/${product.id}`} className="block shrink-0">
                <div className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden relative group-hover:bg-gray-100 transition-colors">
                    {product.imageUrl && !imgError ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-contain p-4"
                            onError={() => setImgError(true)}
                            unoptimized
                        />
                    ) : (
                        <Package size={32} className="text-gray-300" />
                    )}
                </div>
            </Link>

            <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
                <div className="flex flex-col gap-0.5 flex-1">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{product.category}</span>
                    <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 leading-snug text-xs sm:text-[13px] hover:text-indigo-600 transition-colors line-clamp-2 mt-0.5">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                {/* Unit selector */}
                {hasBox && (
                    <div className="flex rounded-lg border border-gray-100 overflow-hidden text-[10px] font-semibold bg-gray-50">
                        <button
                            onClick={() => setUnit("unit")}
                            className={`flex-1 py-1.5 flex items-center justify-center gap-1 transition-colors cursor-pointer ${unit === "unit" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            <Package size={9} />
                            Unidad
                        </button>
                        <button
                            onClick={() => setUnit("box")}
                            className={`flex-1 py-1.5 flex items-center justify-center gap-1 transition-colors cursor-pointer ${unit === "box" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                        >
                            <Box size={9} />
                            Caja ×{product.unitsPerBox}
                        </button>
                    </div>
                )}

                <div className="pt-2.5 border-t border-gray-50 space-y-2.5">
                    {/* Price */}
                    <div className="flex items-end justify-between gap-1">
                        <div>
                            {offerApplies && (
                                <span className="text-[10px] text-gray-400 line-through block leading-none mb-0.5">{fmtArs(regularPriceArs)}</span>
                            )}
                            <p className={`text-base sm:text-lg font-black leading-none ${offerApplies ? "text-rose-600" : "text-gray-900"}`}>
                                {fmtArs(displayPriceArs)}
                            </p>
                        </div>
                        <span className={`text-[10px] font-medium shrink-0 mb-0.5 ${
                            product.stock === 0 && !product.isMadeToOrder ? "text-red-400" :
                            product.stock === 0 && product.isMadeToOrder ? "text-amber-500" : "text-gray-400"
                        }`}>
                            {product.stock === 0
                                ? product.isMadeToOrder ? "Por encargo" : "Sin stock"
                                : `${product.stock} disp.`}
                        </span>
                    </div>

                    {/* Add to cart */}
                    {product.stock === 0 && !product.isMadeToOrder ? (
                        <p className="text-[11px] font-semibold text-gray-400 text-center py-1.5">Sin stock</p>
                    ) : inCart ? (
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => updateQuantity(cartKey, inCart.quantity - 1)}
                                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
                            >
                                <Minus size={12} />
                            </button>
                            <span className="flex-1 text-center text-sm font-black text-gray-900">{inCart.quantity}</span>
                            <button
                                onClick={() => updateQuantity(cartKey, inCart.quantity + 1)}
                                disabled={inCart.quantity >= product.stock}
                                className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-colors shrink-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAdd}
                            className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-[0.97] cursor-pointer ${
                                product.stock === 0 && product.isMadeToOrder
                                    ? "bg-amber-500 text-white hover:bg-amber-400 hover:shadow-md hover:shadow-amber-200"
                                    : "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-md hover:shadow-indigo-200"
                            }`}
                        >
                            <ShoppingCart size={11} />
                            {product.stock === 0 && product.isMadeToOrder ? "Pedir por encargo" : "Agregar"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
