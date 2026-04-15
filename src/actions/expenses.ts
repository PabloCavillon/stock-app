"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ExpenseFormData } from "@/lib/validations/expense";
import { SerializedExpense } from "@/types/expense";
import { revalidatePath } from "next/cache";

function serialize(e: any): SerializedExpense {
    return {
        id: e.id,
        type: e.type,
        description: e.description,
        amountUsd: e.amountUsd !== null ? Number(e.amountUsd) : null,
        amountArs: e.amountArs !== null ? Number(e.amountArs) : null,
        dollarRate: e.dollarRate !== null ? Number(e.dollarRate) : null,
        date: e.date.toISOString(),
        notes: e.notes,
        user: { username: e.user.username },
        createdAt: e.createdAt.toISOString(),
    };
}

export async function getExpenses(): Promise<SerializedExpense[]> {
    const expenses = await prisma.expense.findMany({
        orderBy: { date: "desc" },
        include: { user: { select: { username: true } } },
    });
    return expenses.map(serialize);
}

export async function createExpense(data: ExpenseFormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.expense.create({
        data: {
            type: data.type,
            description: data.description,
            amountUsd: data.amountUsd ?? null,
            amountArs: data.amountArs ?? null,
            dollarRate: data.dollarRate ?? null,
            date: new Date(data.date),
            notes: data.notes ?? null,
            userId: session.user.id,
        },
    });

    revalidatePath("/expenses");
}

export async function deleteExpense(id: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    if (session.user.role !== "ADMIN") throw new Error("Forbidden");
    await prisma.expense.delete({ where: { id } });
    revalidatePath("/expenses");
}

export type ExpenseSummary = {
    totalPurchaseUsd: number;
    totalPurchaseArs: number; // convertido con dollarRate de cada gasto
    totalShippingArs: number;
    totalOtherArs: number;
    grandTotalArs: number;
};

export async function getExpenseSummary(): Promise<ExpenseSummary> {
    const expenses = await prisma.expense.findMany({
        select: { type: true, amountUsd: true, amountArs: true, dollarRate: true },
    });

    let totalPurchaseUsd = 0;
    let totalPurchaseArs = 0;
    let totalShippingArs = 0;
    let totalOtherArs = 0;

    for (const e of expenses) {
        if (e.type === "PURCHASE" && e.amountUsd) {
            const usd = Number(e.amountUsd);
            totalPurchaseUsd += usd;
            totalPurchaseArs += e.dollarRate ? usd * Number(e.dollarRate) : 0;
        } else if (e.type === "SHIPPING" && e.amountArs) {
            totalShippingArs += Number(e.amountArs);
        } else if (e.type === "OTHER" && e.amountArs) {
            totalOtherArs += Number(e.amountArs);
        }
    }

    return {
        totalPurchaseUsd,
        totalPurchaseArs,
        totalShippingArs,
        totalOtherArs,
        grandTotalArs: totalPurchaseArs + totalShippingArs + totalOtherArs,
    };
}
