'use client';

import { OrderStatus } from '@/generated/prisma/enums';
import { cn } from '@/lib/utils';
import { ChartOrder, SerializedOrder } from '@/types/order';
import { STATUS_DESCRIPTION, STATUS_LABEL } from '@/types/order-status';
import * as Tooltip from '@radix-ui/react-tooltip'

export default function OrderStatusTooltip({ order }: { order: SerializedOrder | ChartOrder }) {
	return (
		<Tooltip.Provider delayDuration={100}>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					<span className={cn(
						"inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border",
						order.status === OrderStatus.DELIVERED ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
							order.status === OrderStatus.PENDING ? "bg-amber-50 text-amber-700 border-amber-100" :
								order.status === OrderStatus.CONFIRMED ? "bg-blue-50 text-blue-700 border-blue-100" :
									order.status === OrderStatus.SHIPPED ? "bg-purple-50 text-purple-700 border-purple-100" :
										"bg-zinc-50 text-zinc-500 border-zinc-100"
					)}>
						{STATUS_LABEL[order.status]}
					</span>
				</Tooltip.Trigger>

				<Tooltip.Portal>
					<Tooltip.Content
						side="top"
						align="center"
						className="bg-slate-800 text-white text-sm px-3 py-2 rounded shadow-lg animate-in fade-in zoom-in duration-200"
					>
						{STATUS_DESCRIPTION[order.status]}
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}