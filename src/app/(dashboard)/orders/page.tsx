import { getOrders } from "@/actions/orders";
import OrdersTable from "@/components/orders/orders-table";
import Link from "next/link";

export default async function OrdersPage() {

	const orders = await getOrders();

	return (
		<div className="p-8">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-xl font-semibold text-gray-900">Orders</h1>
					<p className="text-sm text-gray-500 mt-0.5">{orders.length} orders total</p>
				</div>
				<Link
					href="/orders/new"
					className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
				>
					New order
				</Link>
			</div>
			<OrdersTable orders={orders} />
		</div>
	)
}