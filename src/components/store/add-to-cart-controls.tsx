'use client';

import { useCart, CartItem } from "@/contexts/cart-context";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

interface Props {
    item: Omit<CartItem, "quantity">;
    maxQuantity?: number;
}

export function AddToCartControls({ item, maxQuantity }: Props) {
    const { addItem, updateQuantity, items } = useCart();
    const inCart = items.find((i) => i.cartKey === item.cartKey);
    const atMax = maxQuantity !== undefined && inCart !== undefined && inCart.quantity >= maxQuantity;

    if (inCart) {
        return (
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-1.5">
                    <button
                        onClick={() => updateQuantity(item.cartKey, inCart.quantity - 1)}
                        className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                    >
                        {inCart.quantity === 1 ? <Trash2 size={15} /> : <Minus size={15} />}
                    </button>
                    <span className="w-8 text-center text-lg font-black text-gray-900">{inCart.quantity}</span>
                    <button
                        onClick={() => updateQuantity(item.cartKey, inCart.quantity + 1)}
                        disabled={atMax}
                        className="w-10 h-10 rounded-xl border border-indigo-200 bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <Plus size={15} />
                    </button>
                </div>
                <span className="text-sm text-gray-500 font-medium">
                    {inCart.quantity} {item.unit === "box" ? `caja${inCart.quantity !== 1 ? "s" : ""}` : `unidad${inCart.quantity !== 1 ? "es" : ""}`} en el carrito
                    {atMax && <span className="block text-xs text-orange-500 font-bold">Máximo disponible</span>}
                </span>
            </div>
        );
    }

    if (maxQuantity !== undefined && maxQuantity <= 0) {
        return (
            <div className="w-full flex items-center justify-center py-4 rounded-2xl border-2 border-dashed border-gray-200">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sin stock disponible</span>
            </div>
        );
    }

    return (
        <button
            onClick={() => addItem(item)}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gray-900 text-white font-bold text-base hover:bg-gray-700 transition-all active:scale-[0.98] shadow-lg shadow-gray-200"
        >
            <ShoppingCart size={18} />
            Agregar al carrito
        </button>
    );
}
