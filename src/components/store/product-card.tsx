'use client';

import { useCart } from "@/contexts/cart-context";
import { StoreProduct } from "@/actions/store/products.actions";
import { Minus, Plus, ShoppingCart, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function fmtArs(n: number) {
    return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

export function ProductCard({ product }: { product: StoreProduct }) {
    const { addItem, updateQuantity, items } = useCart();
    const [imgError, setImgError] = useState(false);

    const cartKey = `product:${product.id}`;
    const inCart = items.find((i) => i.cartKey === cartKey);

    const handleAdd = () => {
        addItem({
            cartKey,
            type: "product",
            id: product.id,
            name: product.name,
            sku: product.sku,
            priceUsd: product.priceUsd,
            imageUrl: product.imageUrl,
        });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] transition-all group">
            {/* Imagen borde-a-borde */}
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

            {/* Info + precio */}
            <div className="p-3 sm:p-4 flex flex-col gap-3 flex-1">
                <div className="flex flex-col gap-0.5 flex-1">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{product.category}</span>
                    <Link href={`/store/products/${product.id}`}>
                        <h3 className="font-bold text-gray-900 leading-snug text-xs sm:text-sm hover:text-indigo-600 transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="pt-2 border-t border-gray-100 space-y-2">
                    <div>
                        <p className="text-base sm:text-lg font-black text-gray-900">{fmtArs(product.priceArs)}</p>
                    </div>

                    {product.stock === 0 ? (
                        <p className="text-[11px] font-bold text-red-400 uppercase tracking-wider">Sin stock</p>
                    ) : inCart ? (
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
