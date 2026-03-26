'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type Props = {
    data: { month: string; total: number }[]
}

export function SalesByMonthChart({ data }: Props) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Sales by month</h2>
            {data.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-sm text-gray-400">No data yet</div>
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#111827" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                        <Tooltip
                            formatter={(v: number) => [`$${v.toFixed(2)}`, "Total"]}
                            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                        />
                        <Area type="monotone" dataKey="total" stroke="#111827" strokeWidth={2} fill="url(#salesGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}