"use client"

import { ChartBarIcon } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

type Props = {
    data: { status: string; count: number }[]
}

const COLORS: Record<string, string> = {
    PENDING: "#f59e0b",
    CONFIRMED: "#3b82f6",
    SHIPPED: "#8b5cf6",
    DELIVERED: "#10b981",
    CANCELLED: "#ef4444",
}

const LABELS: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
}

export function OrdersByStatusChart({ data }: Props) {
    const formatted = data.map((d) => ({
        name: LABELS[d.status] ?? d.status,
        value: d.count,
        color: COLORS[d.status] ?? "#6b7280",
    }))

    return (
        <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8">
            {/* Header del Gráfico */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-zinc-100 rounded-xl text-zinc-900">
                    <ChartBarIcon size={18} />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">
                        Estado de Órdenes
                    </h2>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Distribución de pedidos
                    </p>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-xs text-zinc-400 italic font-light">
                    No hay datos disponibles aún
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                        <Pie
                            data={formatted}
                            cx="50%"
                            cy="50%"
                            innerRadius={65} // Un poco más fino para un look más moderno
                            outerRadius={90}
                            paddingAngle={5} // Más espacio entre segmentos
                            dataKey="value"
                            stroke="none" // Quitamos el borde blanco de los segmentos
                        >
                            {formatted.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={entry.color}
                                    className="outline-none" // Quitamos el borde azul molesto al hacer foco
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{
                                fontSize: '11px',
                                fontWeight: 'bold',
                                borderRadius: '16px',
                                border: "1px solid #f4f4f5", // zinc-100
                                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.05)",
                                padding: '10px 12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                            iconSize={8}
                            formatter={(value) => (
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">
                                    {value}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );

}