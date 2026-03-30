import { getOrders } from "@/actions/orders";
import OrdersTable from "@/components/orders/orders-table";
import { ShoppingCart } from "lucide-react";
import { PageLayout } from "@/components/common/layout-page";

export const metadata = {
    title: 'Ordenes',
}

export default async function OrdersPage() {
	const orders = await getOrders();

	return (
		<PageLayout
			title="Órdenes"
			subtitle={`Registro Histórico: ${orders.length} pedidos`}
			icon={ShoppingCart}
			buttonText="Nueva Orden"
			buttonHref="/orders/new"
		>
			<OrdersTable orders={orders} />
		</PageLayout>
	)
}