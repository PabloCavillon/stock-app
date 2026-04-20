"use server";

import { auth } from "@/auth";
import { Product } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { SerializedProduct } from "@/types/product";
import { revalidatePath } from "next/cache";

function serialize(p: Product): SerializedProduct {
	return {
		...p,
		price: Number(p.price),
		unitsPerBox: p.unitsPerBox ?? null,
		offerPriceUsd: p.offerPriceUsd !== null && p.offerPriceUsd !== undefined ? Number(p.offerPriceUsd) : null,
		offerUnit: p.offerUnit ?? null,
		createdAt: p.createdAt.toISOString(),
		updatedAt: p.updatedAt.toISOString(),
		deletedAt: p.deletedAt?.toISOString() ?? null,
	};
}

export async function getProducts(): Promise<SerializedProduct[]> {
	const products = await prisma.product.findMany({
		where: { deletedAt: null },
		orderBy: { createdAt: "desc" },
	});
	return products.map(serialize);
}

export async function getProduct(
	id: string,
): Promise<SerializedProduct | null> {
	const product = await prisma.product.findUnique({
		where: { id, deletedAt: null },
	});

	if (!product) return null;
	return serialize(product);
}

export const createProduct = async (data: {
	sku: string;
	name: string;
	description?: string;
	imageUrl?: string;
	price: number;
	stock: number;
	category: string;
	unitsPerBox?: number | null;
	offerPriceUsd?: number | null;
	offerUnit?: string | null;
}) => {
	const session = await auth();
	if (!session?.user?.id) throw new Error("Unauthorized");
	await prisma.product.create({ data });
	revalidatePath("/products");
};

export const updateProduct = async (
	id: string,
	data: {
		sku: string;
		name: string;
		description?: string;
		imageUrl?: string;
		stock: number;
		price: number;
		category: string;
		unitsPerBox?: number | null;
		offerPriceUsd?: number | null;
		offerUnit?: string | null;
	},
) => {
	const session = await auth();
	if (!session?.user?.id) throw new Error("Unauthorized");
	await prisma.product.update({
		where: { id },
		data,
	});
	revalidatePath("/products");
};

export async function deleteProduct(id: string) {
	const session = await auth();
	if (!session?.user?.id) throw new Error("Unauthorized");
	await prisma.product.update({
		where: { id },
		data: { deletedAt: new Date() },
	});
	revalidatePath("/products");
}
