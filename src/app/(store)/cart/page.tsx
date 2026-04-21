'use client';

import { useCart } from "@/contexts/cart-context";
import { Minus, Plus, ShoppingCart, Trash2, ArrowRight, Boxes, Package, Box, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { items, removeItem, updateQuantity } = useCart();
    const router = useRouter();

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
                <div className="p-5 bg-gray-100 rounded-2xl">
                    <ShoppingCart size={40} className="text-gray-400" />
                </div>
                <div>
                    <p className="font-bold text-gray-900 text-lg">Tu carrito está vacío</p>
                    <p className="text-sm text-gray-400 mt-1">Explorá el catálogo y agregá productos</p>
                </div>
                <Link
                    href="/"
                    className="bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 cursor-pointer text-white font-bold px-6 py-3 rounded-xl text-sm transition-all active:scale-[0.98]"
                >
                    Ver catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Tu carrito</h1>
                <p className="text-sm text-gray-400 mt-1">{items.reduce((a, i) => a + i.quantity, 0)} artículos</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                {items.map((item) => (
                    <div key={item.cartKey} className="flex items-center gap-4 px-5 py-4">
                        <div className="shrink-0 text-gray-300">
                            {item.type === "kit" ? <Boxes size={18} /> : item.unit === "box" ? <Box size={18} /> : <Package size={18} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {item.type === "kit" && (
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full">Kit</span>
                                )}
                                {item.unit === "box" && (
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                                        Caja ×{item.unitsPerBox}
                                    </span>
                                )}
                                {item.isOffer && (
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                        <Tag size={8} />
                                        Oferta
                                    </span>
                                )}
                                <p className="font-bold text-gray-900 text-sm leading-snug">{item.name}</p>
                            </div>
                            <p className="text-xs text-gray-400 font-mono uppercase tracking-wider mt-0.5">#{item.sku}</p>
                        </div>

                        {/* Cantidad + eliminar */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <Minus size={13} />
                                </button>
                                <span className="w-7 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <Plus size={13} />
                                </button>
                            </div>
                            <button
                                onClick={() => removeItem(item.cartKey)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3">
                    El precio final en pesos se confirma al momento del pedido según la cotización del día. Pueden aplicar descuentos de gremio o por volumen.
                </p>
                <button
                    onClick={() => router.push("/checkout")}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 cursor-pointer text-white font-bold py-3.5 rounded-xl text-sm transition-all active:scale-[0.98]"
                >
                    Confirmar pedido
                    <ArrowRight size={16} />
                </button>
                <Link
                    href="/"
                    className="block text-center text-sm text-gray-400 hover:text-gray-700 transition-colors"
                >
                    Seguir comprando
                </Link>
            </div>
        </div>
    );
}
