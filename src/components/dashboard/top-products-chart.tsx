"use client"

import { Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type Props = {
	data: { name: string; quantity: number }[]
}

export function TopProductsChart({ data }: Props) {
	return (
		<div className="bg-white rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
			<div className="flex items-center gap-3 mb-6">
				<div className="p-2 bg-zinc-100 rounded-xl text-zinc-900 shrink-0">
					<Star size={18} />
				</div>
				<div>
					<h2 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">Productos Top</h2>
					<p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Rendimiento por unidades</p>
				</div>
			</div>

			{data.length === 0 ? (
				<div className="h-48 flex items-center justify-center text-sm text-zinc-400 italic font-light">
					No hay datos de ventas disponibles
				</div>
			) : (
				<ResponsiveContainer width="100%" height={240}>
					<BarChart data={data} layout="vertical" margin={{ left: -20, right: 20 }}>
						<CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f4f4f5" />
						<XAxis type="number" tick={{ fontSize: 11, fill: "#a1a1aa", fontWeight: 600 }} axisLine={false} tickLine={false} />
						<YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#18181b", fontWeight: 700 }} axisLine={false} tickLine={false} width={120} tickFormatter={(v) => v.length > 15 ? v.slice(0, 15) + "…" : v} />
						<Tooltip cursor={{ fill: '#fafafa' }} contentStyle={{ fontSize: '12px', fontWeight: 'bold', borderRadius: '16px', border: "1px solid #f4f4f5", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.05)", padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
						<Bar name="Cantidad" dataKey="quantity" fill="#18181b" radius={[0, 8, 8, 0]} barSize={20} />
					</BarChart>
				</ResponsiveContainer>
			)}
		</div>
	);
}