import { SerializedOrder } from "./order";
import { AdminStoreOrder } from "@/actions/store/store-orders.actions";

export type UnifiedOrderItem = {
    id: string;
    name: string;
    sku: string | null;
    quantity: number;
    unitPriceDisplay: string;
};

export type UnifiedOrder = {
    id: string;
    code: string;
    source: "manual" | "store";
    customerName: string;
    items: UnifiedOrderItem[];
    totalArs: number;
    status: string;
    createdAt: string;
    notes: string | null;
};

export function fromOrder(order: SerializedOrder): UnifiedOrder {
    return {
        id: order.id,
        code: order.code,
        source: "manual",
        customerName: order.customer?.name ?? "Consumidor Final",
        items: order.items.map((i) => ({
            id: i.id,
            name: i.product.name,
            sku: i.product.sku,
            quantity: i.quantity,
            unitPriceDisplay: `$${i.unitPrice.toLocaleString("es-AR")}`,
        })),
        totalArs: order.total,
        status: order.status,
        createdAt: order.createdAt,
        notes: order.notes ?? null,
    };
}

export function fromStoreOrder(order: AdminStoreOrder): UnifiedOrder {
    const discountFactor = 1 - order.discountApplied / 100;
    const totalArs =
        order.totalArs ??
        Math.round(order.subtotalUsd * discountFactor * order.dollarRateAtCreation);
    return {
        id: order.id,
        code: order.code,
        source: "store",
        customerName: order.customerName,
        items: order.items.map((i) => ({
            id: i.id,
            name: i.productName ?? i.kitName ?? "Artículo",
            sku: i.productSku ?? i.kitSku ?? null,
            quantity: i.quantity,
            unitPriceDisplay: `USD ${i.unitPriceUsd.toFixed(2)}`,
        })),
        totalArs,
        status: order.status,
        createdAt: order.createdAt,
        notes: order.notes ?? null,
    };
}
