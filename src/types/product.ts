export type SerializedProduct = {
	id: string;
	sku: string;
	name: string;
	description: string | null;
	imageUrl: string | null;
	price: number;
	stock: number;
	category: string;
	unitsPerBox: number | null;
	offerPriceUsd: number | null;
	offerUnit: string | null;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
};
