"use client"

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
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Orders by status</h2>
            {data.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-sm text-gray-400">No data yet</div>
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={formatted}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                        >
                            {formatted.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(v: number, name: string) => [v, name]}
                            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                        />
                        <Legend
                            formatter={(value) => <span style={{ fontSize: 12, color: "#6b7280" }}>{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}