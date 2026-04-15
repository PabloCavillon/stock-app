'use client';

import { useCart } from "@/contexts/cart-context";
import { StoreKit } from "@/actions/store/kits.actions";
import { ShoppingCart, Check, Boxes, Package } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

function fmtArs(n: number) {
    return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

export function KitCard({ kit }: { kit: StoreKit }) {
    const { addItem, items } = useCart();
    const [added, setAdded] = useState(false);
    const [imgError, setImgError] = useState(false);

    const cartKey = `kit:${kit.id}`;
    const inCart = items.find((i) => i.cartKey === cartKey);

    const handleAdd = () => {
        addItem({
            cartKey,
            type: "kit",
            id: kit.id,
            name: kit.name,
            sku: kit.sku,
            priceUsd: kit.priceUsd,
            imageUrl: kit.imageUrl,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-5 flex flex-col gap-3 sm:gap-4 hover:shadow-md hover:shadow-gray-200/60 transition-all group relative">
            {/* Badge "Kit" */}
            <span className="absolute top-3 left-3 z-10 text-[9px] font-black uppercase tracking-widest bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                Kit
            </span>

            {/* Imagen */}
            <div className="w-full aspect-square max-h-28 sm:max-h-36 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden group-hover:bg-gray-100 transition-colors relative">
                {kit.imageUrl && !imgError ? (
                    <Image
                        src={kit.imageUrl}
                        alt={kit.name}
                        fill
                        className="object-contain p-2"
                        onError={() => setImgError(true)}
                        unoptimized
                    />
                ) : (
                    <Boxes size={40} className="text-gray-300" />
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1 flex-1">
                <h3 className="font-bold text-gray-900 leading-snug text-sm">{kit.name}</h3>
                {kit.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{kit.description}</p>
                )}

                {/* Contenido del kit */}
                <ul className="mt-1.5 space-y-0.5">
                    {kit.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                            <Package size={10} className="text-gray-300 shrink-0" />
                            <span>{item.productName ?? item.childKitName}</span>
                            <span className="text-gray-300">×{item.quantity}</span>
                        </li>
                    ))}
                </ul>

                <p className="text-[10px] font-mono text-gray-300 uppercase tracking-wider mt-auto pt-2">#{kit.sku}</p>
            </div>

            {/* Precio + botón */}
            <div className="flex items-end justify-between gap-2 pt-2 sm:pt-3 border-t border-gray-100">
                <div>
                    <p className="text-base sm:text-xl font-black text-gray-900">{fmtArs(kit.priceArs)}</p>
                    <p className="text-[10px] text-gray-400">USD {kit.priceUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                </div>
                <button
                    onClick={handleAdd}
                    className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        added ? "bg-emerald-600 text-white"
                        : inCart ? "bg-violet-50 text-violet-700 hover:bg-violet-100"
                        : "bg-gray-900 text-white hover:bg-gray-700"
                    }`}
                >
                    {added ? <Check size={12} /> : <ShoppingCart size={12} />}
                    <span className="hidden sm:inline">{added ? "Agregado" : inCart ? `(${inCart.quantity})` : "Agregar"}</span>
                    <span className="sm:hidden">{added ? "✓" : inCart ? `${inCart.quantity}` : "+"}</span>
                </button>
            </div>
        </div>
    );
}
