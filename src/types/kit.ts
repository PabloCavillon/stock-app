export type SerializedKitItem = {
    id: string;
    kitId: string;
    productId: string | null;
    productName: string | null;
    productSku: string | null;
    childKitId: string | null;
    childKitName: string | null;
    childKitSku: string | null;
    quantity: number;
};

export type SerializedKit = {
    id: string;
    sku: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    price: number; // USD
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    items: SerializedKitItem[];
};
