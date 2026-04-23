import { getOrders } from "@/actions/orders";
import { getAdminStoreOrders } from "@/actions/store/store-orders.actions";
import OrdersTable from "@/components/orders/orders-table";
import { ShoppingCart } from "lucide-react";
import { PageLayout } from "@/components/ui/layout-page";
import { fromOrder, fromStoreOrder } from "@/types/unified-order";

export const metadata = {
    title: 'Ordenes',
}

export default async function OrdersPage() {
    const [orders, storeOrders] = await Promise.all([
        getOrders(),
        getAdminStoreOrders(),
    ]);

    const unified = [
        ...orders.map(fromOrder),
        ...storeOrders.map(fromStoreOrder),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <PageLayout
            title="Órdenes"
            subtitle={`Registro Histórico: ${unified.length} pedidos`}
            icon={ShoppingCart}
            buttonText="Nueva Orden"
            buttonHref="/admin/orders/new"
        >
            <OrdersTable orders={unified} />
        </PageLayout>
    )
}
