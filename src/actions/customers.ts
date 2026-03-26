"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const getCustomers = async () => {
	return prisma.customer.findMany({
		where: { deletedAt: null },
		orderBy: { name: "asc" },
	});
};

export const getCustomer = async (id: string) => {
	return prisma.customer.findUnique({
		where: { id, deletedAt: null },
	});
};

export const createCustomer = async (data: {
	name: string;
	email?: string;
	phone?: string;
	address?: string;
	notes?: string;
}) => {
	const session = await auth();
	if (!session?.user?.id) throw new Error("Unauthorized");
	await prisma.customer.create({ data });
	revalidatePath("/customers");
};

export const updateCustomer = async (
	id: string,
	data: {
		name: string;
		email?: string;
		phone?: string;
		address?: string;
		notes?: string;
	},
) => {
	const session = await auth();
	if (!session?.user?.id) throw new Error("Unauthorized");
	await prisma.customer.update({ where: { id }, data });
	revalidatePath("/customers");
};

export const deleteCustomer = async (id: string) => {
	const session = await auth();
	if (!session?.user?.id) throw new Error("Unauthorized");
	await prisma.customer.update({
		where: { id },
		data: { deletedAt: new Date() },
	});
};
