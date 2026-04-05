import { OrderStatus } from "@/generated/prisma/enums";

export type SerializedOrderItem = {
	id: string;
	productId: string;
	orderId: string;
	quantity: number;
	unitPrice: number;
	product: {
		id: string;
		name: string;
		sku: string;
	};
};

export type SerializedOrder = {
	id: string;
	code: string;
	customerId: string;
	userId: string;
	status: OrderStatus;
	total: number;
	notes: string | null;
	createdAt: string;
	updatedAt: string;
	customer: {
		id: string;
		name: string;
	};
	user: {
		id: string;
		username: string;
	};
	items: SerializedOrderItem[];
};

export type ChartOrder = {
	id: string
    customerName: string
    status: OrderStatus
    total: number
    createdAt: string
}