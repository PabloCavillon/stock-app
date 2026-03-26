export type SerializedStockMovement = {
	id: string;
	productId: string;
	orderId: string | null;
	userId: string;
	type: string;
	quantity: number;
	reason: string | null;
	createdAt: string;
	product: {
		id: string;
		name: string;
		sku: string;
	};
	user: {
		id: string;
		username: string;
	};
	order: { 
        id: string 
    } | null;
};
