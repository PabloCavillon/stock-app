'use client';

import { useCart } from "@/contexts/cart-context";
import { StoreProduct } from "@/actions/store/products.actions";
import { Minus, Plus, ShoppingCart, Package, Tag, Box } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function fmtArs(n: number) {
    return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

export function ProductCard({ product }: { product: StoreProduct }) {
    const { addItem, updateQuantity, items } = useCart();
    const [imgError, setImgError] = useState(false);
    const [unit, setUnit] = useState<"unit" | "box">("unit");

    const hasBox = product.unitsPerBox !== null && product.unitsPerBox > 0;
    const selectedUnit = hasBox ? unit : "unit";

    // Offer applies to the currently selected unit type
    const offerApplies = product.offerPriceUsd !== null && product.offerUnit === selectedUnit;

    // Effective price in USD for the cart
    let effectivePriceUsd: number;
    if (selectedUnit === "box") {
        effectivePriceUsd = offerApplies
            ? product.offerPriceUsd!
            : product.priceUsd * product.unitsPerBox!;
    } else {
        effectivePriceUsd = offerApplies ? product.offerPriceUsd! : product.priceUsd;
    }

    // Display prices in ARS
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
        });
    };

    // Offer badge logic: show if any offer exists
    const hasOffer = product.offerPriceUsd !== null && product.offerUnit !== null;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] transition-all group relative">
            {/* Offer badge */}
            {hasOffer && (
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-sm">
                    <Tag size={9} />
                    Oferta {product.offerUnit === "box" ? "caja" : "unidad"}
                </div>
            )}

            {/* Imagen */}
            <Link href={`/store/products/${product.id}`} className="block shrink-0">
                <div className="w-full aspect-square bg-[#f5f5f5] flex items-center justify-center overflow-hidden transition-colors group-hover:bg-[#ebebeb] relative">
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
                        <Package size={36} className="text-gray-400" />
                    )}
                </div>
            </Link>

            <div className="p-3 sm:p-4 flex flex-col gap-2.5 flex-1">
                <div className="flex flex-col gap-0.5 flex-1">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{product.category}</span>
                    <Link href={`/store/products/${product.id}`}>
                        <h3 className="font-bold text-gray-900 leading-snug text-xs sm:text-sm hover:text-indigo-600 transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                {/* Selector caja/unidad */}
                {hasBox && (
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden text-[10px] font-bold">
                        <button
                            onClick={() => setUnit("unit")}
                            className={`flex-1 py-1.5 flex items-center justify-center gap-1 transition-colors ${unit === "unit" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"}`}
                        >
                            <Package size={10} />
                            Unidad
                        </button>
                        <button
                            onClick={() => setUnit("box")}
                            className={`flex-1 py-1.5 flex items-center justify-center gap-1 transition-colors ${unit === "box" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"}`}
                        >
                            <Box size={10} />
                            Caja ×{product.unitsPerBox}
                        </button>
                    </div>
                )}

                <div className="pt-2 border-t border-gray-100 space-y-2">
                    {/* Precio */}
                    <div className="flex justify-between items-baseline gap-2">
                        <div className="flex flex-col">
                            {offerApplies && (
                                <span className="text-[10px] text-gray-400 line-through leading-none">{fmtArs(regularPriceArs)}</span>
                            )}
                            <p className={`text-base sm:text-lg font-black leading-tight ${offerApplies ? "text-rose-600" : "text-gray-900"}`}>
                                {fmtArs(displayPriceArs)}
                            </p>
                        </div>
                        <span className={`text-[10px] font-bold shrink-0 ${product.stock === 0 ? "text-red-400" : "text-gray-400"}`}>
                            {product.stock === 0 ? "Sin stock" : `${product.stock} disp.`}
                        </span>
                    </div>

                    {/* Botón agregar / controles cantidad */}
                    {inCart ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updateQuantity(cartKey, inCart.quantity - 1)}
                                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
                            >
                                <Minus size={13} />
                            </button>
                            <span className="flex-1 text-center text-sm font-black text-gray-900">{inCart.quantity}</span>
                            <button
                                onClick={() => updateQuantity(cartKey, inCart.quantity + 1)}
                                className="w-8 h-8 rounded-lg border border-indigo-200 bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-colors shrink-0"
                            >
                                <Plus size={13} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAdd}
                            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-gray-900 text-white hover:bg-gray-800 transition-all active:scale-[0.97]"
                        >
                            <ShoppingCart size={12} />
                            Agregar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
