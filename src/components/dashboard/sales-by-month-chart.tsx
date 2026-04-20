'use client'
import { TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useDarkMode } from "@/hooks/use-dark-mode";

type Props = {
    data: { month: string; total: number }[]
}

export function SalesByMonthChart({ data }: Props) {
    const isDark = useDarkMode();

    const gridColor   = isDark ? '#27272a' : '#f4f4f5';
    const labelColor  = isDark ? '#71717a' : '#a1a1aa';
    const lineColor   = isDark ? '#ffffff' : '#18181b';
    const tooltipBg   = isDark ? '#18181b' : '#ffffff';
    const tooltipBorder = isDark ? '#3f3f46' : '#f4f4f5';
    const tooltipText = isDark ? '#e4e4e7' : '#18181b';
    const gradientId  = isDark ? 'salesGradientDark' : 'salesGradientLight';

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 shrink-0">
                    <TrendingUp size={18} />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
                        Rendimiento de Ventas
                    </h2>
                    <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                        Ingresos mensuales
                    </p>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-sm text-zinc-400 italic font-light">
                    No hay datos históricos para mostrar
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor={lineColor} stopOpacity={isDark ? 0.15 : 0.08} />
                                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 11, fill: labelColor, fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: labelColor, fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `$${v.toLocaleString()}`}
                        />
                        <Tooltip
                            cursor={{ stroke: gridColor, strokeWidth: 1 }}
                            contentStyle={{
                                fontSize: '12px',
                                fontWeight: 'bold',
                                borderRadius: '16px',
                                border: `1px solid ${tooltipBorder}`,
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.15)',
                                padding: '10px 12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                color: tooltipText,
                                background: tooltipBg,
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke={lineColor}
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill={`url(#${gradientId})`}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
