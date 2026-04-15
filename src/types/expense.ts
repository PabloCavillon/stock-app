import { ExpenseType } from "@/generated/prisma/enums";

export type SerializedExpense = {
    id: string;
    type: ExpenseType;
    description: string;
    amountUsd: number | null;
    amountArs: number | null;
    dollarRate: number | null;
    date: string;
    notes: string | null;
    user: { username: string };
    createdAt: string;
};
