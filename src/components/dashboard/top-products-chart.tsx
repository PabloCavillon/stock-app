"use client"

import { Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useDarkMode } from "@/hooks/use-dark-mode";

type Props = {
	data: { name: string; quantity: number }[]
}

export function TopProductsChart({ data }: Props) {
	const isDark = useDarkMode();

	const gridColor      = isDark ? '#27272a' : '#f4f4f5';
	const labelColor     = isDark ? '#71717a' : '#a1a1aa';
	const yLabelColor    = isDark ? '#e4e4e7' : '#18181b';
	const barColor       = isDark ? '#a1a1aa' : '#18181b';
	const tooltipBg      = isDark ? '#18181b' : '#ffffff';
	const tooltipBorder  = isDark ? '#3f3f46' : '#f4f4f5';
	const tooltipText    = isDark ? '#e4e4e7' : '#18181b';
	const cursorColor    = isDark ? '#27272a' : '#fafafa';

	return (
		<div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-6">
			<div className="flex items-center gap-3 mb-6">
				<div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 shrink-0">
					<Star size={18} />
				</div>
				<div>
					<h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">Productos Top</h2>
					<p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Rendimiento por unidades</p>
				</div>
			</div>

			{data.length === 0 ? (
				<div className="h-48 flex items-center justify-center text-sm text-zinc-400 italic font-light">
					No hay datos de ventas disponibles
				</div>
			) : (
				<ResponsiveContainer width="100%" height={240}>
					<BarChart data={data} layout="vertical" margin={{ left: -20, right: 20 }} style={{ background: 'transparent' }}>
						<CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
						<XAxis type="number" tick={{ fontSize: 11, fill: labelColor, fontWeight: 600 }} axisLine={false} tickLine={false} />
						<YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: yLabelColor, fontWeight: 700 }} axisLine={false} tickLine={false} width={120} tickFormatter={(v) => v.length > 15 ? v.slice(0, 15) + "…" : v} />
						<Tooltip
							cursor={{ fill: cursorColor }}
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
						<Bar name="Cantidad" dataKey="quantity" fill={barColor} radius={[0, 8, 8, 0]} barSize={20} />
					</BarChart>
				</ResponsiveContainer>
			)}
		</div>
	);
}