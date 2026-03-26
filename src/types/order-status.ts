export const STATUS_LABEL: Record<string, string> = {
	PENDING: "Pending",
	CONFIRMED: "Confirmed",
	SHIPPED: "Shipped",
	DELIVERED: "Delivered",
	CANCELLED: "Cancelled",
};

export const STATUS_STYLE: Record<string, string> = {
	PENDING: "bg-amber-50 text-amber-700",
	CONFIRMED: "bg-blue-50 text-blue-700",
	SHIPPED: "bg-purple-50 text-purple-700",
	DELIVERED: "bg-green-50 text-green-700",
	CANCELLED: "bg-red-50 text-red-700",
};

export const STATUS_FLOW: Record<string, string | null> = {
	PENDING: "CONFIRMED",
	CONFIRMED: "SHIPPED",
	SHIPPED: "DELIVERED",
	DELIVERED: null,
	CANCELLED: null,
};
