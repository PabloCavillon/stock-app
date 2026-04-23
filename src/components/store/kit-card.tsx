'use client';

import { useCart } from "@/contexts/cart-context";
import { StoreKit } from "@/actions/store/kits.actions";
import { fmtArs } from "@/lib/utils";
import { Minus, Plus, ShoppingCart, Boxes, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
            unit: "unit",
            isOffer: false,
        });
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group relative border border-violet-100">
            <span className="absolute top-2.5 left-2.5 z-10 text-[9px] font-bold uppercase tracking-wider bg-violet-600 text-white px-2 py-0.5 rounded-full">
                Kit
            </span>

            {/* Image */}
            <Link href={`/kits/${kit.id}`} className="block shrink-0">
                <div className="w-full aspect-square bg-violet-50 flex items-center justify-center overflow-hidden relative group-hover:bg-violet-100 transition-colors">
                    {kit.imageUrl && !imgError ? (
                        <Image
                            src={kit.imageUrl}
                            alt={kit.name}
                            fill
                            className="object-contain p-4"
                            onError={() => setImgError(true)}
                            unoptimized
                        />
                    ) : (
                        <Boxes size={32} className="text-violet-300" />
                    )}
                </div>
            </Link>

            {/* Info */}
            <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
                <div className="flex flex-col gap-0.5 flex-1">
                    <Link href={`/kits/${kit.id}`}>
                        <h3 className="font-semibold text-gray-900 leading-snug text-xs sm:text-[13px] hover:text-violet-600 transition-colors line-clamp-2">
                            {kit.name}
                        </h3>
                    </Link>
                    <ul className="mt-1.5 space-y-0.5">
                        {kit.items.slice(0, 3).map((item, i) => (
                            <li key={i} className="flex items-center gap-1 text-[10px] text-gray-400">
                                <Package size={8} className="text-gray-300 shrink-0" />
                                <span className="truncate">{item.productName ?? item.childKitName}</span>
                                <span className="shrink-0 text-gray-300">×{item.quantity}</span>
                            </li>
                        ))}
                        {kit.items.length > 3 && (
                            <li className="text-[10px] text-gray-400">+{kit.items.length - 3} más</li>
                        )}
                    </ul>
                </div>

                <div className="pt-2.5 border-t border-gray-50 space-y-2.5">
                    <p className="text-base sm:text-lg font-black text-gray-900 leading-none">{fmtArs(kit.priceArs)}</p>

                    {inCart ? (
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
                                className="w-8 h-8 rounded-lg bg-violet-600 hover:bg-violet-500 flex items-center justify-center text-white transition-colors shrink-0 cursor-pointer"
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAdd}
                            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-500 hover:shadow-md hover:shadow-violet-200 transition-all active:scale-[0.97] cursor-pointer"
                        >
                            <ShoppingCart size={11} />
                            Agregar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
