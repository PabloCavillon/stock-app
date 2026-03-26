import Link from "next/link"
import clsx from "clsx"

type Order = {
    id: string
    customerName: string
    status: string
    total: number
    createdAt: string
}

const STATUS_STYLE: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700",
    CONFIRMED: "bg-blue-50 text-blue-700",
    SHIPPED: "bg-purple-50 text-purple-700",
    DELIVERED: "bg-green-50 text-green-700",
    CANCELLED: "bg-red-50 text-red-700",
}

const STATUS_LABEL: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
}

export function RecentOrdersTable({ orders }: { orders: Order[] }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-medium text-gray-700">Recent orders</h2>
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-left">
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No orders yet</td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-900">{order.customerName}</td>
                                <td className="px-4 py-3">
                                    <span className={clsx("text-xs font-medium px-2 py-1 rounded-full", STATUS_STYLE[order.status])}>
                                        {STATUS_LABEL[order.status]}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-700">${order.total.toFixed(2)}</td>
                                <td className="px-4 py-3 text-gray-500 text-xs">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={`/orders/${order.id}`}
                                        className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}