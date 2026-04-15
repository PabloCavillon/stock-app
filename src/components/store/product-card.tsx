'use client';

import { useCart } from "@/contexts/cart-context";
import { StoreProduct } from "@/actions/store/products.actions";
import { ShoppingCart, Check, Package } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

function fmtArs(n: number) {
    return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

export function ProductCard({ product }: { product: StoreProduct }) {
    const { addItem, items } = useCart();
    const [added, setAdded] = useState(false);
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
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4 hover:shadow-md hover:shadow-gray-200/60 transition-all group">
            {/* Imagen del producto */}
            <div className="w-full aspect-square max-h-36 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden group-hover:bg-gray-100 transition-colors relative">
                {product.imageUrl && !imgError ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                        onError={() => setImgError(true)}
                        unoptimized
                    />
                ) : (
                    <Package size={40} className="text-gray-300" />
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1 flex-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.category}</span>
                <h3 className="font-bold text-gray-900 leading-snug text-sm">{product.name}</h3>
                {product.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{product.description}</p>
                )}
                <p className="text-[10px] font-mono text-gray-300 uppercase tracking-wider mt-auto pt-2">#{product.sku}</p>
            </div>

            {/* Precio + botón */}
            <div className="flex items-end justify-between gap-3 pt-3 border-t border-gray-100">
                <div>
                    <p className="text-xl font-black text-gray-900">{fmtArs(product.priceArs)}</p>
                    <p className="text-[10px] text-gray-400">USD {product.priceUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                </div>
                <button
                    onClick={handleAdd}
                    disabled={product.stock === 0}
                    className={`
                        flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all
                        ${added
                            ? "bg-emerald-600 text-white"
                            : inCart
                                ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                : "bg-gray-900 text-white hover:bg-gray-700"
                        }
                        disabled:opacity-40 disabled:cursor-not-allowed
                    `}
                >
                    {added ? <Check size={13} /> : <ShoppingCart size={13} />}
                    {added ? "Agregado" : inCart ? `En carrito (${inCart.quantity})` : "Agregar"}
                </button>
            </div>
        </div>
    );
}
