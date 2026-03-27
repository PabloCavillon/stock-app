'use client'
import { TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type Props = {
    data: { month: string; total: number }[]
}

export function SalesByMonthChart({ data }: Props) {

    return (
        <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8">
            {/* Header del Gráfico */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-zinc-100 rounded-xl text-zinc-900">
                    <TrendingUp size={18} />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">
                        Rendimiento de Ventas
                    </h2>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Ingresos mensuales
                    </p>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-xs text-zinc-400 italic font-light">
                    No hay datos históricos para mostrar
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                {/* Gradiente basado en Zinc-900 para coherencia total */}
                                <stop offset="5%" stopColor="#18181b" stopOpacity={0.08} />
                                <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        {/* Cuadrícula muy sutil, solo horizontal para limpieza */}
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />

                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 10, fill: "#a1a1aa", fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: "#a1a1aa", fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `$${v.toLocaleString()}`}
                        />

                        <Tooltip
                            cursor={{ stroke: '#e4e4e7', strokeWidth: 1 }}
                            contentStyle={{
                                fontSize: '11px',
                                fontWeight: 'bold',
                                borderRadius: '16px',
                                border: "1px solid #f4f4f5",
                                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.05)",
                                padding: '10px 12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                color: '#18181b'
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#18181b"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#salesGradient)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}