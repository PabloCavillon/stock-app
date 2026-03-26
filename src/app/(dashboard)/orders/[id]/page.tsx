import { getOrder } from "@/actions/orders"
import { cn } from "@/lib/utils"
import { STATUS_LABEL, STATUS_STYLE } from "@/types/order-status"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function OrderDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const order = await getOrder(id)

    if (!order) notFound();

    return (
        <div className="p-8 max-w-2xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Order detail</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <Link
                    href="/orders"
                    className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
                >
                    ← Back
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-medium text-gray-900">{order.customer.name}</p>
                    </div>
                    <span className={cn("text-xs font-medium px-2 py-1 rounded-full", STATUS_STYLE[order.status])}>
                        {STATUS_LABEL[order.status]}
                    </span>
                </div>

                {/* Items */}
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50 text-left">
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Unit price</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {order.items.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-3 font-medium text-gray-900">{item.product.name}</td>
                                <td className="px-6 py-3 font-mono text-xs text-gray-500">{item.product.sku}</td>
                                <td className="px-6 py-3 text-gray-700">{item.quantity}</td>
                                <td className="px-6 py-3 text-gray-700">${item.unitPrice.toFixed(2)}</td>
                                <td className="px-6 py-3 text-gray-700">${(item.unitPrice * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    {order.notes && (
                        <p className="text-sm text-gray-500">{order.notes}</p>
                    )}
                    <div className="ml-auto text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-lg font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}