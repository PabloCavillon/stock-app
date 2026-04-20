'use client';

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type CartItem = {
    cartKey: string;    // "product:id:unit" | "product:id:box" | "kit:id"
    type: "product" | "kit";
    id: string;         // productId or kitId
    name: string;
    sku: string;
    priceUsd: number;   // effective price: box price if unit=box, offer price if offer applies
    imageUrl?: string | null;
    quantity: number;
    unit: "unit" | "box";
    unitsPerBox?: number;   // filled when unit === "box"
    isOffer: boolean;
};

type CartContextValue = {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (cartKey: string) => void;
    updateQuantity: (cartKey: string, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "projaska_cart_v3";

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setItems(JSON.parse(stored));
        } catch { /* ignore */ }
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items, hydrated]);

    const addItem = useCallback((product: Omit<CartItem, "quantity">) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.cartKey === product.cartKey);
            if (existing) {
                return prev.map((i) =>
                    i.cartKey === product.cartKey ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    }, []);

    const removeItem = useCallback((cartKey: string) => {
        setItems((prev) => prev.filter((i) => i.cartKey !== cartKey));
    }, []);

    const updateQuantity = useCallback((cartKey: string, quantity: number) => {
        if (quantity <= 0) {
            setItems((prev) => prev.filter((i) => i.cartKey !== cartKey));
        } else {
            setItems((prev) =>
                prev.map((i) => (i.cartKey === cartKey ? { ...i, quantity } : i))
            );
        }
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}
