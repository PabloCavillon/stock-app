import { OrderStatus, StoreOrderStatus } from "@/generated/prisma/enums";

export const STATUS_LABEL: Record<OrderStatus, string> = {
	PENDING: "Pendiente",
	CONFIRMED: "Preparando",
	SHIPPED: "Disponible",
	DELIVERED: "Entregado",
	CANCELLED: "Cancelado",
};

export const STATUS_STYLE: Record<OrderStatus, string> = {
	PENDING: "bg-amber-50 text-amber-700",
	CONFIRMED: "bg-blue-50 text-blue-700",
	SHIPPED: "bg-purple-50 text-purple-700",
	DELIVERED: "bg-green-50 text-green-700",
	CANCELLED: "bg-red-50 text-red-700",
};

export const STATUS_FLOW: Record<OrderStatus, string | null> = {
	PENDING: "CONFIRMED",
	CONFIRMED: "SHIPPED",
	SHIPPED: "DELIVERED",
	DELIVERED: null,
	CANCELLED: null,
};

export const STATUS_DESCRIPTION: Record<OrderStatus, string> = {
	PENDING: "El pedido fue recibido y aguarda validación o pago.",
	CONFIRMED: "El pedido se está preparando actualmente",
	SHIPPED: "Proceso terminado. Listo para ser retirado o enviado.",
	DELIVERED: "El cliente ya tiene el producto.",
	CANCELLED: "El pedido fue anulado y no se realizarán más acciones.",
}

// ─── Store Order Status ───────────────────────────────────────────────────────

export const STORE_STATUS_LABEL: Record<StoreOrderStatus, string> = {
	PENDING: "Pendiente",
	PAYMENT_REGISTERED: "Pago Registrado",
	CONFIRMED: "Preparando",
	SHIPPED: "Disponible",
	DELIVERED: "Entregado",
	CANCELLED: "Cancelado",
};

export const STORE_STATUS_STYLE: Record<StoreOrderStatus, string> = {
	PENDING: "bg-amber-50 text-amber-700 border-amber-100",
	PAYMENT_REGISTERED: "bg-blue-50 text-blue-700 border-blue-100",
	CONFIRMED: "bg-indigo-50 text-indigo-700 border-indigo-100",
	SHIPPED: "bg-purple-50 text-purple-700 border-purple-100",
	DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-100",
	CANCELLED: "bg-zinc-50 text-zinc-500 border-zinc-100",
};

export const STORE_STATUS_FLOW: Record<StoreOrderStatus, StoreOrderStatus | null> = {
	PENDING: StoreOrderStatus.PAYMENT_REGISTERED,
	PAYMENT_REGISTERED: StoreOrderStatus.CONFIRMED,
	CONFIRMED: StoreOrderStatus.SHIPPED,
	SHIPPED: StoreOrderStatus.DELIVERED,
	DELIVERED: null,
	CANCELLED: null,
};