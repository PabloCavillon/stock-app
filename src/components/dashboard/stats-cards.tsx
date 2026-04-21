'use client';

import { cn } from "@/lib/utils";
import { Package, Users as UsersIcon, ShoppingBag, AlertTriangle, TrendingUp, TrendingDown, Megaphone } from "lucide-react";

type Stats = {
    totalProducts: number;
    totalCustomers: number;
    totalOrders: number;
    lowStockCount: number;
    totalRevenueArs: number;
    totalExpensesArs: number;
    totalAdvertisingArs: number;
};

const countCards = [
    { key: "totalProducts", label: "Productos", icon: Package },
    { key: "totalCustomers", label: "Clientes", icon: UsersIcon },
    { key: "totalOrders", label: "Órdenes", icon: ShoppingBag },
    { key: "lowStockCount", label: "Stock Bajo", icon: AlertTriangle, warning: true },
] as const;

function fmtArs(n: number) {
    if (Math.abs(n) >= 1_000_000)
        return (n / 1_000_000).toLocaleString("es-AR", { maximumFractionDigits: 1 }) + "M";
    if (Math.abs(n) >= 1_000)
        return (n / 1_000).toLocaleString("es-AR", { maximumFractionDigits: 0 }) + "k";
    return n.toLocaleString("es-AR", { maximumFractionDigits: 0 });
}

export function StatsCards({ stats }: { stats: Stats }) {
    const netArs = stats.totalRevenueArs - stats.totalExpensesArs;
    const isProfit = netArs >= 0;

    return (
        <div className="space-y-4">
            {/* Contadores — bg-white y colores zinc se invierten solos via CSS vars en dark mode */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {countCards.map((card) => {
                    const value = stats[card.key as keyof Pick<Stats, "totalProducts" | "totalCustomers" | "totalOrders" | "lowStockCount">];
                    const isWarning = "warning" in card && card.warning && value > 0;
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.key}
                            className={cn(
                                "bg-white rounded-3xl border p-4 flex flex-col items-center gap-2 transition-all hover:shadow-md hover:shadow-zinc-200/50 group",
                                isWarning ? "border-amber-200 bg-amber-50" : "border-zinc-200"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "p-2 rounded-xl transition-all duration-300",
                                    isWarning
                                        ? "bg-amber-100 text-amber-600"
                                        : "bg-zinc-100 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white"
                                )}>
                                    <Icon size={18} strokeWidth={2} />
                                </div>
                                <span className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight leading-none">{value}</span>
                            </div>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">{card.label}</span>
                        </div>
                    );
                })}
            </div>

            {/* P&L — bg-*-50 y border-*-100 se oscurecen solos via CSS vars en dark mode */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {/* Ingresos: text-emerald-700 → #34d399 en dark (overrideado), value necesita dark:text-white */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-xl shrink-0">
                        <TrendingUp size={18} className="text-emerald-700" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Ingresos</p>
                        <p className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-white">$ {fmtArs(stats.totalRevenueArs)}</p>
                    </div>
                </div>

                {/* Gastos: text-red-600 → #f87171 en dark (overrideado), value necesita dark:text-white */}
                <div className="bg-red-50 border border-red-100 rounded-3xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-xl shrink-0">
                        <TrendingDown size={18} className="text-red-600" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Gastos</p>
                        <p className="text-xl sm:text-2xl font-black text-red-900 dark:text-white">$ {fmtArs(stats.totalExpensesArs)}</p>
                    </div>
                </div>

                {/* Publicidad: purple-50/100/700 ahora están en globals.css */}
                <div className="bg-purple-50 border border-purple-100 rounded-3xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-xl shrink-0">
                        <Megaphone size={18} className="text-purple-700" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-purple-700 uppercase tracking-widest">Publicidad</p>
                        <p className="text-xl sm:text-2xl font-black text-purple-900 dark:text-white">$ {fmtArs(stats.totalAdvertisingArs)}</p>
                    </div>
                </div>

                {/* Resultado */}
                <div className={cn(
                    "rounded-3xl p-4 flex items-center gap-3 border",
                    isProfit ? "bg-zinc-900 border-zinc-900" : "bg-red-900 border-red-900"
                )}>
                    <div className="p-2 rounded-xl shrink-0 bg-white/10">
                        {isProfit
                            ? <TrendingUp size={18} className="text-white" />
                            : <TrendingDown size={18} className="text-white" />
                        }
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Resultado</p>
                        <p className="text-xl sm:text-2xl font-black text-white">$ {fmtArs(Math.abs(netArs))}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{isProfit ? "ganancia est." : "pérdida est."}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
