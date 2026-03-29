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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => {
                const value = stats[card.key as keyof Stats];
                const isWarning = card.warning && value > 0;
                const Icon = card.icon;

                return (
                    <div
                        key={card.key}
                        className={cn(
                            "bg-white rounded-4xl border p-6 flex items-center gap-5 transition-all hover:shadow-md hover:shadow-zinc-200/50 group",
                            isWarning ? "border-amber-100 bg-amber-50/10" : "border-zinc-100"
                        )}
                    >
                        <div className={cn(
                            "p-3 rounded-2xl transition-all duration-300",
                            isWarning
                                ? "bg-amber-100 text-amber-600 shadow-sm shadow-amber-100"
                                : "bg-zinc-50 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white"
                        )}>
                            <Icon size={24} strokeWidth={2} />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-zinc-900 tracking-tight leading-none">
                                {value}
                            </span>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em] mt-1">
                                {card.label}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}