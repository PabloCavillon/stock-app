'use client';

import { useCart } from "@/contexts/cart-context";
import { StoreKit } from "@/actions/store/kits.actions";
import { Minus, Plus, ShoppingCart, Boxes, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function fmtArs(n: number) {
    return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

export function KitCard({ kit }: { kit: StoreKit }) {
    const { addItem, updateQuantity, items } = useCart();
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
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 flex flex-col gap-3 hover:shadow-md hover:shadow-gray-200/60 transition-all group relative">
            <span className="absolute top-2.5 left-2.5 z-10 text-[9px] font-black uppercase tracking-widest bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                Kit
            </span>

            {/* Imagen */}
            <Link href={`/store/kits/${kit.id}`} className="block">
                <div className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden group-hover:bg-gray-100 transition-colors relative">
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
                        <Boxes size={36} className="text-gray-300" />
                    )}
                </div>
            </Link>

            {/* Info */}
            <div className="flex flex-col gap-0.5 flex-1">
                <Link href={`/store/kits/${kit.id}`}>
                    <h3 className="font-bold text-gray-900 leading-snug text-xs sm:text-sm hover:text-violet-600 transition-colors line-clamp-2">
                        {kit.name}
                    </h3>
                </Link>
                <ul className="mt-1 space-y-0.5">
                    {kit.items.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Package size={9} className="text-gray-300 shrink-0" />
                            <span className="truncate">{item.productName ?? item.childKitName}</span>
                            <span className="shrink-0 text-gray-300">×{item.quantity}</span>
                        </li>
                    ))}
                    {kit.items.length > 3 && (
                        <li className="text-[10px] text-gray-300">+{kit.items.length - 3} más</li>
                    )}
                </ul>
            </div>

            {/* Precio + controles */}
            <div className="pt-2 border-t border-gray-100 space-y-2">
                <div>
                    <p className="text-base sm:text-lg font-black text-gray-900">{fmtArs(kit.priceArs)}</p>
                    <p className="text-[10px] text-gray-400">USD {kit.priceUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                </div>

                {inCart ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => updateQuantity(cartKey, inCart.quantity - 1)}
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors shrink-0"
                        >
                            <Minus size={13} />
                        </button>
                        <span className="flex-1 text-center text-sm font-black text-gray-900">{inCart.quantity}</span>
                        <button
                            onClick={() => updateQuantity(cartKey, inCart.quantity + 1)}
                            className="w-8 h-8 rounded-lg border border-violet-200 bg-violet-50 flex items-center justify-center text-violet-600 hover:bg-violet-100 transition-colors shrink-0"
                        >
                            <Plus size={13} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleAdd}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-gray-900 text-white hover:bg-gray-700 transition-all active:scale-[0.97]"
                    >
                        <ShoppingCart size={12} />
                        Agregar
                    </button>
                )}
            </div>
        </div>
    );
}
