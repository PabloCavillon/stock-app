import { OrderStatus } from "@/generated/prisma/enums";
import { SerializedCustomer } from "./customer";
import { SerializedUser } from "./user";
import { SerializedProduct } from "./product";

export type SerializedOrderItem = {
	id: string;
	productId: string;
	orderId: string;
	quantity: number;
	unitPrice: number;
	product: SerializedProduct;
};

export type SerializedOrder = {
	id: string;
	code: string;
	dollarRate: number;
	customerId: string;
	userId: string;
	status: OrderStatus;
	total: number;
	notes: string | null;
	createdAt: string;
	updatedAt: string;
	customer: SerializedCustomer;
	user: SerializedUser;
	items: SerializedOrderItem[];
};

export type ChartOrder = {
	id: string;
	customerName: string;
	status: OrderStatus;
	total: number;
	createdAt: string;
};
