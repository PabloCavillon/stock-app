import { getCustommers } from "@/actions/customers";
import { getProducts } from "@/actions/products";
import { OrderForm } from "@/components/orders/orders-from";

export default async function NewOrderPage() {

    const [products, customers] = await Promise.all([
        getProducts(),
        getCustommers()
    ])

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">New order</h1>
                <p className="text-sm text-gray-500 mt-0.5">Create a new order for a customer</p>
            </div>
            <OrderForm products={products} customers={customers} />
        </div>
    );
}