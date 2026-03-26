'use client';

import { updateOrderStatus } from '@/actions/orders';
import { OrderStatus } from '@/generated/prisma/enums';
import { cn } from '@/lib/utils';
import { SerializedOrder } from '@/types/order';
import { STATUS_FLOW, STATUS_LABEL, STATUS_STYLE } from '@/types/order-status';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OrdersTable({ orders: initialOrders }: { orders: SerializedOrder[] }) {

    const router = useRouter();
    const [orders, setOrders] = useState<SerializedOrder[]>(initialOrders)
    const [updating, setUpdating] = useState<string | null>(null)
    const [search, setSearch] = useState<string>('')

    const filtered = orders.filter(o =>
        o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        o.status.toLowerCase().includes(search.toLowerCase())
    )

    const handleAdvanceStatus = async (order: SerializedOrder) => {
        const nextStatus = STATUS_FLOW[order.status];
        if (!nextStatus) return;

        setUpdating(order.id)
        await updateOrderStatus(order.id, nextStatus as OrderStatus);
        setOrders(prev =>
            prev.map(o => (o.id === order.id ? { ...o, status: nextStatus } : o))
        )
        setUpdating(null);
        router.refresh()
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
                <input
                    type="text"
                    placeholder="Search by customer or status..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-sm text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
            </div>

            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-left">
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filtered.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                No orders found
                            </td>
                        </tr>
                    ) : (
                        filtered.map((order) => {
                            const nextStatus = STATUS_FLOW[order.status]
                            return (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">{order.customer.name}</td>
                                    <td className="px-4 py-3 text-gray-500">{order.items.length} item(s)</td>
                                    <td className="px-4 py-3 text-gray-700">${order.total.toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        <span className={cn("text-xs font-medium px-2 py-1 rounded-full", STATUS_STYLE[order.status])}>
                                            {STATUS_LABEL[order.status]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/orders/${order.id}`}
                                                className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors"
                                            >
                                                View
                                            </Link>
                                            {nextStatus && (
                                                <button
                                                    onClick={() => handleAdvanceStatus(order)}
                                                    disabled={updating === order.id}
                                                    className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors disabled:opacity-50"
                                                >
                                                    {updating === order.id ? "Updating..." : `Mark as ${STATUS_LABEL[nextStatus]}`}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

