'use client';

import { cn } from "@/lib/utils";
import { Package, Users as UsersIcon, ShoppingBag, AlertTriangle } from "lucide-react";

type Stats = {
    totalProducts: number;
    totalCustomers: number;
    totalOrders: number;
    lowStockCount: number;
};

const cards = [
    {
        key: "totalProducts",
        label: "Productos",
        icon: Package,
    },
    {
        key: "totalCustomers",
        label: "Clientes",
        icon: UsersIcon,
    },
    {
        key: "totalOrders",
        label: "Órdenes",
        icon: ShoppingBag,
    },
    {
        key: "lowStockCount",
        label: "Stock Bajo",
        icon: AlertTriangle,
        warning: true,
    },
];

export function StatsCards({ stats }: { stats: Stats }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => {
                const value = stats[card.key as keyof Stats];
                const isWarning = card.warning && value > 0;
                const Icon = card.icon;

                return (
                    <div
                        key={card.key}
                        className={cn(
                            "bg-white rounded-3xl border p-4 flex flex-col items-center gap-2 transition-all hover:shadow-md hover:shadow-zinc-200/50 group",
                            isWarning ? "border-amber-100 bg-amber-50/10" : "border-zinc-200"
                        )}
                    >
                        {/* Ícono + Número en la misma fila */}
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "p-2 rounded-xl transition-all duration-300",
                                isWarning
                                    ? "bg-amber-100 text-amber-600"
                                    : "bg-zinc-50 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white"
                            )}>
                                <Icon size={18} strokeWidth={2} />
                            </div>
                            <span className="text-3xl font-black text-zinc-900 tracking-tight leading-none">
                                {value}
                            </span>
                        </div>

                        {/* Label centrado abajo */}
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">
                            {card.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}